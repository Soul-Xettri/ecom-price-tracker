import Header from "@/components/containers/Header";
import TrackedProductOverview from "@/components/custom-ui/dashboard/tracked-products-overview";

export default function TrackedProductPage() {
  return (
    <>
      <Header title={"Tracked Products"} />
      <TrackedProductOverview />
    </>
  );
}
