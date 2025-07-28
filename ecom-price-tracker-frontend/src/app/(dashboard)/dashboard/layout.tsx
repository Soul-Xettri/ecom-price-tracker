import { SidebarInset } from "@/components/ui/sidebar";

export default function layout({ children }: { children: React.ReactNode }) {
  return <SidebarInset>{children}</SidebarInset>;
}
