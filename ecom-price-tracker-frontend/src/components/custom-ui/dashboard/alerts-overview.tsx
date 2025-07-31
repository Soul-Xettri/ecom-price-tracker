"use client";

import useAuthStore from "@/lib/zustand/authStore";
import { useUserStore } from "@/lib/zustand/useUserStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader,
  ExternalLink,
  Bell,
  Mail,
  Target,
  Calendar,
  TrendingDown,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function AlertsOverview() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const hasFetched = useRef(false);

  const fetchAlerts = async () => {
    const response = await fetch("/api/alerts/fetch", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 401 || response.status === 403) {
      setIsLoading(false);
      useUserStore.getState().logout();
      useAuthStore.getState().logout();
      await signOut({ callbackUrl: "/?session-expired=true" });
      return;
    }
    if (!response.ok) {
      setIsLoading(false);
      toast.error("Failed to fetch alerts");
      return;
    }
    const data = await response.json();
    setAlerts(data.data.alerts || []);
    setIsLoading(false);
    toast.success("Alerts fetched successfully");
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    setIsLoading(true);
    fetchAlerts();
  }, []);

  const AlertCard = ({ alert }: { alert: any }) => {
    const calculateSavings = () => {
      if (!alert.originalPrice) return null;
      const savings = alert.originalPrice - alert.price;
      const percentage = ((savings / alert.originalPrice) * 100).toFixed(1);
      return { amount: savings, percentage };
    };

    const savings = calculateSavings();

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="">
          {/* Server Info Header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              {alert.serverIcon ? (
                <Image
                  src={alert.serverIcon}
                  alt={alert.serverName}
                  width={24}
                  height={24}
                  className="rounded-full"
                  unoptimized={false}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                  <Bell className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                </div>
              )}
              <div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {alert.serverName}
                </span>
                {alert.channelName && (
                  <span className="text-gray-500 dark:text-gray-400 ml-1">
                    → #{alert.channelName}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {alert.discordAlert && (
                <>
                  <Badge
                    variant="outline"
                    className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                  >
                    <Bell className="w-3 h-3 mr-1" />
                    Discord
                  </Badge>
                  {alert.emailAlert && (
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    >
                      <Mail className="w-3 h-3 mr-1" />
                      Email
                    </Badge>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Product Content */}
          <div className="flex items-start space-x-4">
            {alert.imageUrl && (
              <Image
                src={alert.imageUrl}
                alt={alert.title}
                width={120}
                height={120}
                className="w-30 h-30 object-cover rounded-lg"
                unoptimized={false}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.png";
                }}
              />
            )}

            <div className="flex-1">
              <h3
                className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2"
                title={alert.title}
              >
                {alert.title}
              </h3>

              <div className="flex items-center space-x-2 mb-3">
                {alert.ecommercePlatform && (
                  <Badge
                    variant="outline"
                    className={
                      alert.ecommercePlatform === "daraz"
                        ? "bg-orange-400 text-white"
                        : alert.ecommercePlatform === "ebay"
                        ? "bg-green-400 text-white"
                        : alert.ecommercePlatform === "flipkart"
                        ? "bg-blue-400 text-white"
                        : "bg-gray-400 text-white"
                    }
                  >
                    {alert.ecommercePlatform.toUpperCase()}
                  </Badge>
                )}

                <Badge
                  variant="default"
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white"
                >
                  <TrendingDown className="w-3 h-3 mr-1" />
                  Price Dropped!
                </Badge>

                {alert.discount && (
                  <Badge
                    variant="outline"
                    className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                  >
                    🔻 {alert.discount}
                  </Badge>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Alert Date:
                  </span>
                  <span className="flex items-center text-sm">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(alert.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {alert.originalPrice && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Original Price:
                    </span>
                    <span className="font-bold text-lg text-gray-900 dark:text-white">
                      <span className="line-through text-gray-400">
                        Rs. {alert.originalPrice}
                      </span>
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Current Price:
                  </span>
                  <span className="font-bold text-lg text-green-600 dark:text-green-400">
                    Rs. {alert.price}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Target Price:
                  </span>
                  <span className="font-medium text-indigo-600 dark:text-indigo-400 flex items-center">
                    <Target className="w-3 h-3 mr-1" />
                    Rs. {alert.desiredPrice}
                  </span>
                </div>

                {savings && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      You Saved:
                    </span>
                    <span className="font-medium text-orange-600 dark:text-orange-400">
                      Rs. {savings.amount} ({savings.percentage}% off)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link
              href={alert.productUrl}
              target="_blank"
              className="cursor-pointer"
            >
              <Button variant="outline" size="sm" className="cursor-pointer">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Product
              </Button>
            </Link>

            <div className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(alert.createdAt).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Alerts Overview
            </h1>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {alerts.length > 0 && (
                <>
                  Found {alerts.length} alert{alerts.length !== 1 ? "s" : ""}
                </>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader className="w-6 h-6 mx-auto my-4 animate-spin" />
            </div>
          ) : alerts.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {alerts.map((alert) => (
                <AlertCard key={alert._id} alert={alert} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              No alerts found. Start tracking products to receive alerts when
              prices drop!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
