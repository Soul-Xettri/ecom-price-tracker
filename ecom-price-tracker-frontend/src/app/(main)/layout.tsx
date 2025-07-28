import TopNav from "@/components/custom-ui/nav-component/top-nav";

export default function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNav />
      {children}
    </>
  );
}
