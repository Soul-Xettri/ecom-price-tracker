"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Bell,
  Plus,
  Trash2,
  ExternalLink,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { trackedProductsDummy } from "@/utils/dummyData";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/lib/zustand/useUserStore";
import useAuthStore from "@/lib/zustand/authStore";
import Cookies from "js-cookie";
import Image from "next/image";

export default function DashboardOverview() {
  const [newProductUrl, setNewProductUrl] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const { data: session } = useSession();
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const user = useUserStore((state) => state.user);
  const setTokens = useAuthStore((state) => state.setTokens);

  useEffect(() => {
    const saveUserToBackend = async () => {
      if (!session?.user) return;
      const token = Cookies.get("accessToken");
      const sameUser = user?.discordId === session.user.id;

      if (isLoggedIn && sameUser && token) return;

      try {
        const res = await fetch("/api/save-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            discordId: session.user.id,
            name: session.user.name,
            email: session.user.email,
            avatar: session.user.image,
            exp: session.expires,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          useUserStore.getState().setUser(data.data.user);
          setTokens(data.data.token);
        }
      } catch (error) {
        console.error("Error recording user:", error);
      }
    };

    saveUserToBackend();
  }, [session]);

  const handleAddProduct = () => {
    if (newProductUrl && targetPrice) {
      // Add product logic here
      setNewProductUrl("");
      setTargetPrice("");
    }
  };
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, John! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Here's what's happening with your tracked products
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Products
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      12
                    </p>
                  </div>
                  <Package className="w-8 h-8 text-indigo-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Price Drops
                    </p>
                    <p className="text-2xl font-bold text-green-600">3</p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Money Saved
                    </p>
                    <p className="text-2xl font-bold text-cyan-600">$247</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-cyan-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Active Alerts
                    </p>
                    <p className="text-2xl font-bold text-orange-600">8</p>
                  </div>
                  <Bell className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add Product Card */}
          <Card className="border-2 border-dashed border-indigo-200 dark:border-indigo-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="w-5 h-5 text-indigo-500" />
                <span>Add New Product to Track</span>
              </CardTitle>
              <CardDescription>
                Paste a product URL from Amazon, Daraz, or Flipkart to start
                tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="product-url">Product URL</Label>
                  <Input
                    id="product-url"
                    placeholder="https://www.amazon.com/product-name/dp/..."
                    value={newProductUrl}
                    // onChange={(e: any) => setNewProductUrl(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="target-price">Target Price ($)</Label>
                  <Input
                    id="target-price"
                    type="number"
                    placeholder="999"
                    value={targetPrice}
                    onChange={(e: any) => setTargetPrice(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <Button
                onClick={handleAddProduct}
                className="mt-4 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Start Tracking
              </Button>
            </CardContent>
          </Card>

          {/* Recent Products */}
          <Card>
            <CardHeader>
              <CardTitle>Recently Tracked Products</CardTitle>
              <CardDescription>
                Your latest price tracking activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trackedProductsDummy.slice(0, 3).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <Image
                      src={product.image || "/placeholder.png"}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded-lg"
                      unoptimized={false}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.png";
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {product.platform}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          ${product.currentPrice}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Target: ${product.targetPrice}
                        </span>
                        <Badge
                          variant={
                            product.status === "price_dropped"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            product.status === "price_dropped"
                              ? "bg-green-500 hover:bg-green-600"
                              : ""
                          }
                        >
                          {product.status === "price_dropped"
                            ? "Price Dropped!"
                            : "Tracking"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700 bg-transparent"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
