"use client";

import { useUserStore } from "@/lib/zustand/useUserStore";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "../ui/breadcrumb";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import { useState } from "react";
import { signOut } from "next-auth/react";
import useAuthStore from "@/lib/zustand/authStore";

export default function Header({ title }: { title: string }) {
  const user = useUserStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <header className="sticky top-0 bg-background z-50 flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1 cursor-pointer" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="w-full flex justify-between items-center">
        <Breadcrumb className="w-full">
          <BreadcrumbList className="flex justify-between items-center">
            <BreadcrumbItem>
              <BreadcrumbPage className="text-xl">{title}</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbItem className="pr-8">
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
                      <span className="font-mono text-sm">{user?.email}</span>
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
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
