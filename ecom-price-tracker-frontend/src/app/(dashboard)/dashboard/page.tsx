import Header from "@/components/containers/Header";
import DashboardOverview from "@/components/custom-ui/dashboard/dashboad-overview";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();
  return (
    <>
      <Header title={"Dashboard"} />
      <DashboardOverview />
    </>
  );
}
