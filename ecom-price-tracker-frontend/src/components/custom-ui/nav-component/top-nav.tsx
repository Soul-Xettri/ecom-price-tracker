"use client";

import { MainSidebar } from "@/components/containers/MainSideBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import useAuthStore from "@/lib/zustand/authStore";
import { useUserStore } from "@/lib/zustand/useUserStore";
import { Bot, TrendingDown } from "lucide-react";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { use, useState } from "react";

export default function TopNav() {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const user = useUserStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
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
              {!isLoggedIn ? (
                <Button
                  onClick={() => {
                    setIsLoading(true);
                    signIn("discord", { callbackUrl: "/dashboard" });
                  }}
                  className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white cursor-pointer"
                  disabled={isLoading}
                >
                  <Bot className="w-4 h-4 mr-2" />
                  Connect Discord
                </Button>
              ) : (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost" className="cursor-pointer">
                      Dashboard
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-gradient-to-r hover:from-indigo-100 hover:to-cyan-100 dark:hover:from-indigo-900 dark:hover:to-cyan-900 transition cursor-pointer"
                      >
                        <Avatar className="rounded-xl select-none">
                          <AvatarImage
                            src={user?.avatar}
                            className="border-2 border-indigo-500 rounded-full object-cover object-top"
                            alt="User Avatar"
                          />
                          <AvatarFallback>
                            <div className="border-2 border-cyan-500 h-full w-full rounded-full flex items-center justify-center bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold">
                              {user?.name?.charAt(0).toUpperCase()}
                            </div>
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-indigo-700 dark:text-cyan-300">
                          {user?.name}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="min-w-[220px] bg-white dark:bg-gray-900 border border-indigo-200 dark:border-cyan-800 shadow-lg rounded-xl"
                      align="end"
                    >
                      <DropdownMenuGroup>
                        <DropdownMenuItem className="flex flex-col items-start py-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Discord ID
                          </span>
                          <span className="font-mono text-sm">
                            {user?.discordId}
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex flex-col items-start py-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Name
                          </span>
                          <span className="font-semibold">{user?.name}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex flex-col items-start py-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Email
                          </span>
                          <span className="font-mono text-sm">
                            {user?.email}
                          </span>
                        </DropdownMenuItem>
                        {/* // logout button */}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900 cursor-pointer"
                          onClick={async () => {
                            setIsLoading(true);
                            useUserStore.getState().logout();
                            useAuthStore.getState().logout();
                            await signOut({ callbackUrl: "/" });
                          }}
                        >
                          <span className="font-semibold">Logout</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
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
