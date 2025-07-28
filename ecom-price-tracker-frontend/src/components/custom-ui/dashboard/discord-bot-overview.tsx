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
import { Plus, Trash2, ExternalLink, Users, Bot } from "lucide-react";
import { trackedProducts } from "@/utils/dummyData";

export default function DiscordBotOverview() {
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
                  <Button className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600">
                    <Bot className="w-4 h-4 mr-2" />
                    Add to Discord Server
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
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
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-medium text-green-900 dark:text-green-100">
                        Connected
                      </span>
                    </div>
                    <Badge className="bg-green-500 hover:bg-green-600">
                      Online
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Server:
                      </span>
                      <span className="font-medium">My Awesome Server</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Channel:
                      </span>
                      <span className="font-medium">#price-alerts</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Notifications Sent:
                      </span>
                      <span className="font-medium">47</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Configure Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
