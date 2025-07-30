"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Bot, Loader, Server } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function DiscordBotOverview() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingChannels, setIsFetchingChannels] = useState(false);
  const [servers, setServers] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchDiscordServers = async () => {
      const response = await fetch("/api/discord/fetch-servers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        setIsLoading(false);
        toast.error("Failed to fetch Discord servers");
        return;
      }
      const data = await response.json();
      setServers(data.data.servers);
      setIsLoading(false);
      toast.success("Discord servers fetched successfully");
    };
    fetchDiscordServers();
  }, []);

  const [channels, setChannels] = useState<any[]>([]);

  const fetchChannels = async (guildId: string) => {
    setIsFetchingChannels(true);
    const response = await fetch(
      `/api/discord/fetch-channels?guildId=${guildId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      setIsFetchingChannels(false);
      toast.error("Failed to fetch Discord channels");
      return;
    }
    const data = await response.json();
    setChannels(data);
    setIsFetchingChannels(false);
  };

  const handleServerUpdate = async (
    serverId: string,
    channelId: string,
    channelName: string,
    botAlertStatus: boolean
  ) => {
    if (!channelId || !channelName) {
      toast.error("Please choose a channel");
      return;
    }
    setIsUpdating(true);
    const response = await fetch("/api/discord/update-server", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        serverId,
        channelId,
        channelName,
        botAlertStatus,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setIsUpdating(false);
      toast.error(data.error || "Failed to update Discord server");
      return
    }
    // Optionally, you can refetch the servers to update the UI
    const updatedServers = servers.map((server) =>
      server._id === serverId ? { ...server, ...data.data.servers } : server
    );
    setServers(updatedServers);
    setIsUpdating(false);
    toast.success("Discord server updated successfully");
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Discord Bot Integration
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Connect our bot to your Discord server to receive instant price
              drop notifications
            </p>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader className="w-6 h-6 mx-auto my-4 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bot className="w-5 h-5 text-indigo-500" />
                    <span>Add Bot to Server</span>
                  </CardTitle>
                  <CardDescription>
                    Invite PriceTracker bot to your Discord server to start
                    receiving notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-950 rounded-lg">
                      <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
                        Bot Permissions Required:
                      </h4>
                      <ul className="text-sm text-indigo-700 dark:text-indigo-300 space-y-1">
                        <li>• Send Messages</li>
                        <li>• Embed Links</li>
                        <li>• Read Message History</li>
                      </ul>
                    </div>
                    <Button
                      onClick={async () => {
                        const res = await fetch("/api/discord/invite-link");
                        const data = await res.json();
                        window.location.href = data.url;
                      }}
                      className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 cursor-pointer"
                    >
                      <Bot className="w-4 h-4 mr-2" />
                      Add to Discord Server
                    </Button>
                  </div>
                </CardContent>
              </Card>
              {servers.length > 0 &&
                servers.map((server) => (
                  <Card key={server.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-green-500" />
                        <span>Bot Status</span>
                      </CardTitle>
                      <CardDescription>
                        Current connection status and server information
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                          <div className="flex items-center space-x-2">
                            {server.botAlertStatus ? (
                              <>
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="font-medium text-green-900 dark:text-green-100">
                                  Connected
                                </span>
                              </>
                            ) : (
                              <>
                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="font-medium text-red-900 dark:text-red-100">
                                  Disconnected
                                </span>
                              </>
                            )}
                          </div>
                          {server.botAlertStatus ? (
                            <Badge className="bg-green-500 hover:bg-green-600">
                              Online
                            </Badge>
                          ) : (
                            <Badge className="bg-red-500 hover:bg-red-600">
                              Offline
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Server:
                            </span>
                            <span className="font-medium flex flex-row items-center gap-2">
                              <Avatar className="rounded-xl select-none">
                                <AvatarImage
                                  src={server?.serverIcon}
                                  className="border-2 border-indigo-500 rounded-full object-cover object-top"
                                  alt="User Avatar"
                                />
                                <AvatarFallback>
                                  <div className="border-2 border-cyan-500 h-full w-full rounded-full flex items-center justify-center bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold">
                                    {server.serverName?.charAt(0).toUpperCase()}
                                  </div>
                                </AvatarFallback>
                              </Avatar>
                              {server.serverName ?? "My Awesome Server"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Channel:
                            </span>
                            <span className="font-medium">
                              #{server.channelName ? server.channelName : ""}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Notifications Sent:
                            </span>
                            <span className="font-medium">
                              {server.alertCount}
                            </span>
                          </div>
                        </div>
                        <Dialog
                          open={isDialogOpen}
                          onOpenChange={setIsDialogOpen}
                        >
                          <DialogTrigger
                            onClick={(event) => event.stopPropagation()}
                            asChild
                          >
                            <Button
                              variant="outline"
                              className="w-full bg-transparent cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              Configure Settings
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <div className="flex gap-4 items-center">
                                <div className="flex h-[48px] w-[48px] p-[12px] border rounded-[10px] justify-center items-center">
                                  <Server />
                                </div>
                                <div>
                                  <DialogTitle className="hidden">
                                    Configure Server Settings
                                  </DialogTitle>
                                  <div className="text-[18px] leading-5 text-secondary-foreground font-[500]">
                                    Configure Server Settings
                                  </div>
                                  <div className="font-[400] text-[14px] text-gray-500">
                                    Set up your server and channel for
                                    notifications
                                  </div>
                                </div>
                              </div>
                            </DialogHeader>
                            <hr />
                            <form>
                              <div className="grid gap-4 py-4">
                                <div className="flex flex-col gap-2">
                                  <Label htmlFor="email">Server Name</Label>
                                  <Input
                                    defaultValue={server.serverName}
                                    type="text"
                                    className="h-[45px] text-gray-500 select-none cursor-not-allowed"
                                    readOnly
                                  />
                                </div>
                                <div className="flex flex-col gap-2">
                                  <Label htmlFor="email">Choose Channel</Label>
                                  <DropdownMenu
                                    modal
                                    onOpenChange={(open) => {
                                      if (open) {
                                        fetchChannels(server.serverId);
                                      }
                                    }}
                                  >
                                    <DropdownMenuTrigger asChild>
                                      <Input
                                        value={
                                          server.selectedChannelName ||
                                          server.channelName ||
                                          ""
                                        }
                                        className="h-[45px] text-gray-500 cursor-pointer"
                                      />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-full">
                                      {isFetchingChannels ? (
                                        <Loader className="w-6 h-6 mx-auto my-4 animate-spin" />
                                      ) : (
                                        channels.map((channel) => (
                                          <DropdownMenuItem
                                            key={channel.id}
                                            className="w-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                                            onSelect={() => {
                                              setServers((prevServers) =>
                                                prevServers.map((s) =>
                                                  s.id === server.id
                                                    ? {
                                                        ...s,
                                                        selectedChannelName:
                                                          channel.name,
                                                        selectedChannelId:
                                                          channel.id,
                                                        channelName:
                                                          channel.name,
                                                      }
                                                    : s
                                                )
                                              );
                                            }}
                                          >
                                            {channel.name}
                                          </DropdownMenuItem>
                                        ))
                                      )}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                                <div className="flex flex-row items-center gap-2">
                                  <Switch
                                    checked={server.botAlertStatus}
                                    onCheckedChange={(checked) =>
                                      setServers((prevServers) =>
                                        prevServers.map((s) =>
                                          s.id === server.id
                                            ? { ...s, botAlertStatus: checked }
                                            : s
                                        )
                                      )
                                    }
                                    className="cursor-pointer data-[state=checked]:bg-gradient-to-r from-indigo-500 to-cyan-500 "
                                  />
                                  <Label>Bot Alert Status</Label>
                                </div>
                                <div className="flex flex-row items-center justify-between">
                                  <Button
                                    type="button"
                                    onClick={() =>
                                      handleServerUpdate(
                                        server._id,
                                        server.selectedChannelId ||
                                          server.channelId,
                                        server.selectedChannelName ||
                                          server.channelName,
                                        server.botAlertStatus
                                      )
                                    }
                                    className=" bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 cursor-pointer"
                                    disabled={
                                      (!server.channelId &&
                                        !server.selectedChannelId) ||
                                      (!server.channelName &&
                                        !server.selectedChannelName) ||
                                      isUpdating
                                    }
                                  >
                                    Save Settings
                                  </Button>
                                </div>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
