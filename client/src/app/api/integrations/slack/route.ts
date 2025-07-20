import { NextRequest, NextResponse } from "next/server";
import { WebClient } from "@slack/web-api";
import { db } from "@/server/db";
import { connectionsTable } from "@/server/db/schema";
import { getCurrentUser } from "@/server/services/user";
import { eq, and } from "drizzle-orm";
import {
  batchInsertEmbeddings,
  ChunkInput,
} from "@/server/services/embeddings-batch";

interface SlackCredentials {
  access_token: string;
  team_id: string;
  team_name: string;
  bot_user_id: string;
  scope: string;
  token_type: string;
}

interface SlackMessage {
  channel: string;
  channelId: string;
  text: string;
  user: string;
  timestamp: string;
  permalink: string;
}

// Save selected channels or sync Slack data for a project
export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, selectedChannels: selectedChannelsFromBody } =
      await req.json();

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 },
      );
    }

    // Get Slack connection for this project
    const connection = await db
      .select()
      .from(connectionsTable)
      .where(
        and(
          eq(connectionsTable.projectId, projectId),
          eq(connectionsTable.type, "slack"),
          eq(connectionsTable.isActive, 1),
        ),
      )
      .limit(1);

    if (connection.length === 0) {
      return NextResponse.json(
        { error: "No active Slack connection found" },
        { status: 404 },
      );
    }

    const { credentials } = connection[0];
    const slackCredentials = credentials as {
      access_token: string;
      team_id: string;
      team_name: string;
      bot_user_id: string;
      scope: string;
      token_type: string;
    };

    // If selectedChannels is provided, save the channel selection
    if (selectedChannelsFromBody) {
      const currentSettings =
        (connection[0].settings as Record<string, unknown>) || {};

      await db
        .update(connectionsTable)
        .set({
          settings: {
            ...currentSettings,
            selectedChannels: selectedChannelsFromBody,
            lastChannelUpdate: new Date().toISOString(),
          },
          updatedAt: new Date(),
        })
        .where(eq(connectionsTable.id, connection[0].id));

      return NextResponse.json({
        success: true,
        message: `Saved ${selectedChannelsFromBody.length} selected channels`,
        selectedChannels: selectedChannelsFromBody,
      });
    }

    // Otherwise, perform a sync operation
    const slackClient = new WebClient(slackCredentials.access_token);

    // Get selected channels from connection settings
    const currentSettings =
      (connection[0].settings as Record<string, unknown>) || {};
    const selectedChannelsForSync: string[] =
      (currentSettings.selectedChannels as string[]) || [];

    if (!selectedChannelsForSync.length) {
      return NextResponse.json(
        {
          error:
            "No selected Slack channels to sync. Please select channels first.",
        },
        { status: 400 },
      );
    }

    // Fetch messages from each selected channel
    const allChunks: ChunkInput[] = [];
    for (const channelId of selectedChannelsForSync) {
      try {
        // Fetch up to 100 most recent messages per channel
        const history = await slackClient.conversations.history({
          channel: channelId,
          limit: 100,
        });
        const channelMessages = history.messages || [];

        for (const msg of channelMessages) {
          if (!msg.text || typeof msg.text !== "string") continue;
          const chunk: ChunkInput = {
            projectId,
            sourceType: "slack",
            sourceId: msg.ts || "",
            chunkText: msg.text,
            metadata: {
              channelId,
              user: msg.user || "",
              timestamp: msg.ts || "",
              permalink: `https://slack.com/archives/${channelId}/p${msg.ts?.replace(".", "")}`,
            },
          };
          allChunks.push(chunk);
        }
      } catch (err) {
        console.warn(`Failed to fetch messages for channel ${channelId}:`, err);
      }
    }

    // Insert all message embeddings
    await batchInsertEmbeddings(allChunks);

    const syncedData = {
      channels: selectedChannelsForSync.length,
      messagesEmbedded: allChunks.length,
      lastSync: new Date().toISOString(),
    };

    // Update connection with sync info
    await db
      .update(connectionsTable)
      .set({
        settings: {
          ...currentSettings,
          ...syncedData,
        },
        updatedAt: new Date(),
      })
      .where(eq(connectionsTable.id, connection[0].id));

    return NextResponse.json({
      success: true,
      data: syncedData,
      message: `Embedded ${allChunks.length} Slack messages from ${selectedChannelsForSync.length} channels.`,
    });
  } catch (error) {
    console.error("Slack sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync Slack data" },
      { status: 500 },
    );
  }
}

// Get Slack data (channels or messages for AI processing)
export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const query = searchParams.get("query");
    const action = searchParams.get("action"); // 'channels' or 'messages'

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 },
      );
    }

    // Get Slack connection for this project
    const connection = await db
      .select()
      .from(connectionsTable)
      .where(
        and(
          eq(connectionsTable.projectId, parseInt(projectId)),
          eq(connectionsTable.type, "slack"),
          eq(connectionsTable.isActive, 1),
        ),
      )
      .limit(1);

    if (connection.length === 0) {
      return NextResponse.json(
        { error: "No active Slack connection found" },
        { status: 404 },
      );
    }

    const { credentials } = connection[0];
    const slackCredentials = credentials as {
      access_token: string;
      team_id: string;
      team_name: string;
      bot_user_id: string;
      scope: string;
      token_type: string;
    };
    const slackClient = new WebClient(slackCredentials.access_token);

    // If action is 'channels', return available channels
    if (action === "channels") {
      const channelsResponse = await slackClient.conversations.list({
        types: "public_channel,private_channel",
        limit: 200,
      });

      if (!channelsResponse.ok) {
        return NextResponse.json(
          { error: "Failed to fetch Slack channels" },
          { status: 500 },
        );
      }

      const channels = channelsResponse.channels || [];

      // Get membership info for each channel
      const channelsWithMembership = await Promise.all(
        channels.map(async (channel) => {
          try {
            // Check if bot is a member of the channel
            const membersResponse = await slackClient.conversations.members({
              channel: channel.id!,
            });

            const isMember =
              membersResponse.members?.includes(slackCredentials.bot_user_id) ||
              false;

            return {
              id: channel.id,
              name: channel.name,
              is_private: channel.is_private || false,
              is_member: isMember,
              num_members: channel.num_members,
              purpose: channel.purpose,
            };
          } catch {
            // If we can't check membership, assume we're not a member
            return {
              id: channel.id,
              name: channel.name,
              is_private: channel.is_private || false,
              is_member: false,
              num_members: channel.num_members,
              purpose: channel.purpose,
            };
          }
        }),
      );

      return NextResponse.json({
        channels: channelsWithMembership,
        connection: {
          name: connection[0].name,
          teamId: slackCredentials.team_id,
        },
      });
    }

    // If query is provided, search for relevant messages
    if (query) {
      const messages = await getRelevantMessages(slackClient, query);
      return NextResponse.json({
        messages,
        query,
        connection: {
          name: connection[0].name,
          teamId: slackCredentials.team_id,
        },
      });
    }

    // Otherwise, return connection info
    return NextResponse.json({
      connection: {
        name: connection[0].name,
        teamId: slackCredentials.team_id,
        settings: connection[0].settings,
      },
    });
  } catch (error) {
    console.error("Slack data fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Slack data" },
      { status: 500 },
    );
  }
}

// Helper function to get relevant messages
async function getRelevantMessages(
  slackClient: WebClient,
  query: string,
  maxMessages = 50,
): Promise<SlackMessage[]> {
  const messages: SlackMessage[] = [];
  const keywords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((k) => k.length > 2);

  try {
    const channelsResponse = await slackClient.conversations.list({
      types: "public_channel,private_channel",
      limit: 20,
    });

    const channels = channelsResponse.channels || [];

    for (const channel of channels.slice(0, 10)) {
      // Limit to first 10 channels
      try {
        const history = await slackClient.conversations.history({
          channel: channel.id!,
          limit: maxMessages,
        });

        const channelMessages = history.messages || [];

        for (const msg of channelMessages) {
          const text = msg.text || "";
          const lowerText = text.toLowerCase();

          if (keywords.some((kw) => lowerText.includes(kw))) {
            messages.push({
              channel: channel.name || "unknown",
              channelId: channel.id || "",
              text,
              user: msg.user || "unknown",
              timestamp: msg.ts || "",
              permalink: `https://slack.com/archives/${channel.id}/p${msg.ts?.replace(".", "")}`,
            });
          }
        }
      } catch (err: unknown) {
        const error = err as { data?: { error?: string } };
        console.warn(`Skipping channel ${channel.name}:`, error.data?.error);
      }
    }
  } catch (error) {
    console.error("Error fetching Slack messages:", error);
  }

  return messages.slice(0, 20); // Return top 20 relevant messages
}
