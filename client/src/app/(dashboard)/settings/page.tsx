import { getCurrentUser } from "@/server/services/user";
import { redirect } from "next/navigation";
import SettingsClient from "./settings-client";

const SettingsPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return <SettingsClient user={user} />;
};

export default SettingsPage;
