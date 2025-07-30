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
  DialogDescription,
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
  const [servers, setServers] = useState<any[]>([]);
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
  };

  useEffect(() => {
    setIsLoading(true);
    fetchDiscordServers();
    toast.success("Discord servers fetched successfully");
  }, []);

  const ServerCards = ({ server }: { server: any }) => {
    const [localDialogOpen, setLocalDialogOpen] = useState(false);
    const [localIsFetchingChannels, setLocalIsFetchingChannels] =
      useState(false);
    const [localChannels, setLocalChannels] = useState<any[]>([]);
    const [localChannel, setLocalChannel] = useState({
      id: server.channelId || "",
      name: server.channelName || "",
    });
    const [botStatus, setBotStatus] = useState(server.botAlertStatus);
    const [isUpdating, setIsUpdating] = useState(false);
    const [deleteInProgress, setDeleteInProgress] = useState(false);
    const [updatedChannel, setUpdatedChannel] = useState({
      id: server.channelId || "",
      name: server.channelName || "",
    });
    const [updatedBotStatus, setUpdatedBotStatus] = useState(
      server.botAlertStatus
    );

    const fetchChannels = async (guildId: string) => {
      setLocalIsFetchingChannels(true);
      const response = await fetch(
        `/api/discord/fetch-channels?guildId=${guildId}`
      );
      if (!response.ok) {
        setLocalIsFetchingChannels(false);
        toast.error("Failed to fetch Discord channels");
        return;
      }
      const data = await response.json();
      setLocalChannels(data);
      setLocalIsFetchingChannels(false);
    };

    const handleSave = async () => {
      if (!localChannel.id || !localChannel.name) {
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
          serverId: server._id,
          channelId: localChannel.id,
          channelName: localChannel.name,
          botAlertStatus: botStatus,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setIsUpdating(false);
        toast.error(data.error || "Failed to update Discord server");
        return;
      }
      setUpdatedBotStatus(botStatus);
      setUpdatedChannel({
        id: localChannel.id,
        name: localChannel.name,
      });
      setIsUpdating(false);
      toast.success("Discord server updated successfully");
    };

    const handleDelete = async () => {
      if (!confirm("Are you sure you want to remove this server?")) return;
      setDeleteInProgress(true);
      const response = await fetch("/api/discord/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ serverId: server._id }),
      });

      const data = await response.json();
      if (!response.ok) {
        setDeleteInProgress(false);
        toast.error(data.error || "Failed to delete Discord server");
        return;
      }
      setDeleteInProgress(false);
      toast.success("Discord server removed successfully");
      fetchDiscordServers(); // Refresh the list after deletion
    };

    return (
      <Card className="hover:shadow-lg transition-shadow">
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
                {botStatus ? (
                  <>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="font-medium text-green-900 dark:text-green-100">
                      Connected
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <span className="font-medium text-red-900 dark:text-red-100">
                      Disconnected
                    </span>
                  </>
                )}
              </div>
              {updatedBotStatus ? (
                <Badge className="bg-green-500 hover:bg-green-600">
                  Online
                </Badge>
              ) : (
                <Badge className="bg-red-500 hover:bg-red-600">Offline</Badge>
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
                <span className="font-medium">#{updatedChannel.name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Notifications Sent:
                </span>
                <span className="font-medium">{server.alertCount}</span>
              </div>
            </div>

            <Dialog open={localDialogOpen} onOpenChange={setLocalDialogOpen}>
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
                      <DialogTitle className="text-[18px] leading-5 text-secondary-foreground font-[500]">
                        Configure Server Settings
                      </DialogTitle>
                      <DialogDescription className="font-[400] text-[14px] text-gray-500">
                        Set up your server and channel for notifications
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                <hr />
                <form>
                  <div className="grid gap-4 py-4">
                    <div className="flex flex-col gap-2">
                      <Label>Server Name</Label>
                      <Input
                        value={server.serverName}
                        readOnly
                        className="h-[45px] text-gray-500 cursor-not-allowed"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Choose Channel</Label>
                      <DropdownMenu
                        modal
                        onOpenChange={(open) =>
                          open && fetchChannels(server.serverId)
                        }
                      >
                        <DropdownMenuTrigger asChild>
                          <Input
                            value={localChannel.name}
                            readOnly
                            className="h-[45px] text-gray-500 cursor-pointer"
                          />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full">
                          {localIsFetchingChannels ? (
                            <Loader className="w-6 h-6 mx-auto my-4 animate-spin" />
                          ) : (
                            localChannels.map((channel) => (
                              <DropdownMenuItem
                                key={channel.id}
                                className="cursor-pointer"
                                onSelect={() =>
                                  setLocalChannel({
                                    id: channel.id,
                                    name: channel.name,
                                  })
                                }
                              >
                                {channel.name}
                              </DropdownMenuItem>
                            ))
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={botStatus}
                        onCheckedChange={setBotStatus}
                        className="cursor-pointer data-[state=checked]:bg-gradient-to-r from-indigo-500 to-cyan-500"
                      />
                      <Label>Bot Alert Status</Label>
                    </div>
                    <div className="flex justify-between">
                      <Button
                        type="button"
                        onClick={handleSave}
                        disabled={
                          !localChannel.id || isUpdating || deleteInProgress
                        }
                        className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 cursor-pointer"
                      >
                        Save Settings
                        {isUpdating && (
                          <Loader className="w-4 h-4 ml-2 animate-spin" />
                        )}
                      </Button>
                      <Button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleteInProgress || isUpdating}
                        className="
                        bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700
                        cursor-pointer"
                      >
                        Remove Server
                        {deleteInProgress && (
                          <Loader className="w-4 h-4 ml-2 animate-spin" />
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    );
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
              <Card className="hover:shadow-lg transition-shadow">
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
                  <ServerCards key={server.id} server={server} />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
