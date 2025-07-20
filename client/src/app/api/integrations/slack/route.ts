import { NextRequest, NextResponse } from "next/server";
import { WebClient } from "@slack/web-api";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";

// Initialize clients
const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);
const geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const GEMINI_MODEL = "gemini-2.0-flash";

// Fetch relevant messages from Slack with keyword matching
async function getRelevantMessages(
  prompt: string,
  maxMessages = 100
): Promise<string[]> {
  const messages: string[] = [];
  const keywords = prompt
    .toLowerCase()
    .split(/\s+/)
    .filter((k) => k.length > 2); // ignore short words

  try {
    const channelsRes = await slackClient.conversations.list({
      types: "public_channel,private_channel",
    });

    for (const channel of channelsRes.channels ?? []) {
      const channelId = channel.id!;
      const channelName = (channel as any).name ?? "unknown";

      try {
        const history = await slackClient.conversations.history({
          channel: channelId,
          limit: maxMessages,
        });

        for (const msg of history.messages ?? []) {
          const text = (msg as any).text || "";
          const lowerText = text.toLowerCase();

          if (keywords.some((kw) => lowerText.includes(kw))) {
            messages.push(`[${channelName}] ${text}`);
          }
        }
      } catch (err: any) {
        if (err.data?.error === "not_in_channel") {
          console.warn(`Skipping #${channelName} (bot not in channel)`);
        } else {
          console.error(`Error reading #${channelName}:`, err.data?.error);
        }
      }
    }
  } catch (e: any) {
    console.error("Slack API error while listing channels:", e.data?.error);
  }

  return messages;
}

// Summarize Slack messages using Gemini with "why" context
async function summarizeMessagesWithGeminiStream(
  messages: string[]
): Promise<string> {
  if (messages.length === 0) return "No relevant messages found.";

  const inputText =
    "You are an assistant that reads Slack messages and answers the question: Why?\n\n" +
    "Here are the relevant Slack messages:\n" +
    messages.join("\n") +
    "\n\nPlease provide a concise explanation answering the question.";

  const model = geminiClient.getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: {
      responseMimeType: "text/plain",
    },
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ],
  });

  try {
    const result = await model.generateContentStream({
      contents: [
        {
          role: "user",
          parts: [{ text: inputText }],
        },
      ],
    });

    let summary = "";
    for await (const chunk of result.stream) {
      summary += chunk.text();
      process.stdout.write(chunk.text());
    }
    return summary.trim();
  } catch (error: any) {
    console.error("Gemini API error during streaming:", error.message);
    return `Gemini API error during streaming: ${error.message}`;
  }
}

// API route handler
export async function GET(req: NextRequest) {
  const prompt = req.nextUrl.searchParams.get("query");

  if (!prompt) {
    return NextResponse.json(
      { error: "Missing 'query' parameter" },
      { status: 400 }
    );
  }

  const messages = await getRelevantMessages(prompt);
  const summary = await summarizeMessagesWithGeminiStream(messages);

  return NextResponse.json({ prompt, summary });
}
