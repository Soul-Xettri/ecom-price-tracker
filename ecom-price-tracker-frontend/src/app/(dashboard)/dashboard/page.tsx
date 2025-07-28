import Header from "@/components/containers/Header";
import DashboardOverview from "@/components/custom-ui/dashboard/dashboad-overview";

export default function DashboardPage() {
  return (
    <>
      <Header title={"Dashboard"} />
      <DashboardOverview />
    </>
  );
}
