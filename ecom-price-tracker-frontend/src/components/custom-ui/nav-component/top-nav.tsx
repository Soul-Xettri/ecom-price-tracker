"use client";

import { MainSidebar } from "@/components/containers/MainSideBar";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Bot, TrendingDown } from "lucide-react";
import Link from "next/link";

export default function TopNav() {
  return (
    <>
      <nav className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 max-md:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                  PriceTracker
                </span>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" className="cursor-pointer">Dashboard</Button>
              </Link>
              <Button className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white cursor-pointer">
                <Bot className="w-4 h-4 mr-2" />
                Connect Discord
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <SidebarProvider className="md:hidden min-h-fit">
        <MainSidebar />
        <header className="sticky top-0 bg-background z-50 flex h-16 shrink-0 items-center gap-2 px-4 justify-between w-full">
          <Link href="/">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                PriceTracker
              </span>
            </div>
          </Link>
          <SidebarTrigger className="-ml-1 cursor-pointer" />
        </header>
      </SidebarProvider>
    </>
  );
}
