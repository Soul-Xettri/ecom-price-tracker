import Header from "@/components/containers/Header";
import AlertsOverview from "@/components/custom-ui/dashboard/alerts-overview";


export default function SettingPage() {
  return (
    <>
      <Header title={"Alerts"} />
      <AlertsOverview />
    </>
  );
}
