import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "../ui/sidebar";
import {
  Bell,
  Bot,
  LayoutDashboard,
  Package,
  Settings,
  TrendingDown,
} from "lucide-react";
import { Separator } from "../ui/separator";
import Link from "next/link";
import DashNavTop from "../custom-ui/nav-component/dashboard-top-nav";

const data = {
  projects: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Tracked Products",
      url: "/dashboard/products",
      icon: Package,
    },
    {
      name: "Alerts",
      url: "/dashboard/alerts",
      icon: Bell,
    },
    {
      name: "Discord Bot",
      url: "/dashboard/discord",
      icon: Bot,
    },
    {
      name: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="bg-white dark:bg-gray-800 mt-2">
        <SidebarMenu className="m-0">
          <SidebarMenuItem className="list-none self-center">
            <Link href="/">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                  PriceTracker
                </span>
              </div>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-white dark:bg-gray-800">
        <Separator className="mt-2 mb-0 ml-4 h-[2px] w-[86%]" />
        <DashNavTop projects={data.projects} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
