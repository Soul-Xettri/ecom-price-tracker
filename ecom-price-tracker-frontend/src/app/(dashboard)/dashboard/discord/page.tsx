import Header from "@/components/containers/Header";
import DiscordBotOverview from "@/components/custom-ui/dashboard/discord-bot-overview";

export default function DiscordBotPage() {
  return (
    <>
      <Header title={"Discord Bot"} />
      <DiscordBotOverview />
    </>
  );
}
