import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { type LucideIcon } from "lucide-react";
import Link from "next/link";

export default function DashNavTop({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon?: LucideIcon;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarMenu className="m-0 space-y-2">
        {projects.map((item) => (
          <SidebarMenuItem key={item.name} className="list-none">
            <SidebarMenuButton
              asChild
              className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Link href={item.url} className="!text-[16px]">
                {item.icon && <item.icon className="!w-5 !h-5" />}
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
