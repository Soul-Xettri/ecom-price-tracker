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
  ExternalLink,
  TrendingDown,
  TrendingUp,
  Loader,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useUserStore } from "@/lib/zustand/useUserStore";
import useAuthStore from "@/lib/zustand/authStore";
import Cookies from "js-cookie";
import Image from "next/image";
import { toast } from "sonner";
import Link from "next/link";

export default function DashboardOverview() {
  const [newProductUrl, setNewProductUrl] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const { data: session } = useSession();
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const user = useUserStore((state) => state.user);
  const setTokens = useAuthStore((state) => state.setTokens);
  const [trackedProducts, setTrackedProducts] = useState<any[]>([]);
  const [isScraping, setIsScraping] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("daraz");
  const hasFetched = useRef(false);

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
        toast.success("User data saved successfully");
      }
    } catch (error) {
      console.error("Error recording user:", error);
      toast.error("Failed to save user data");
    }
  };

  const fetchTrackedProducts = async () => {
    const response = await fetch("/api/product/fetch-products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 401 || response.status === 403) {
      useUserStore.getState().logout();
      useAuthStore.getState().logout();
      await signOut({ callbackUrl: "/?session-expired=true" });
      return;
    }
    if (!response.ok) {
      toast.error("Failed to load dashboard data");
      return;
    }
    const data = await response.json();
    setTrackedProducts(data.data.products || []);
    toast.success("Dashboard data loaded successfully");
  };

  useEffect(() => {
    const saveAndFetch = async () => {
      await saveUserToBackend();
      if (hasFetched.current) return;
      hasFetched.current = true;
      // Wait for user to be saved before fetching products
      await fetchTrackedProducts();
    };
    if (session) {
      saveAndFetch();
    }
  }, [session]);

  const handleAddProduct = async () => {
    if (!newProductUrl || !targetPrice || !selectedPlatform) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (parseFloat(targetPrice) <= 0) {
      toast.error("Target price must be greater than 0.");
      return;
    }
    setIsScraping(true);
    const response = await fetch("/api/product/scrape-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: newProductUrl,
        ecommercePlatform: selectedPlatform,
        desiredPrice: parseFloat(targetPrice),
      }),
    });
    const data = await response.json();
    if (response.status === 401 || response.status === 403) {
      setIsScraping(false);
      useUserStore.getState().logout();
      useAuthStore.getState().logout();
      await signOut({ callbackUrl: "/?session-expired=true" });
      return;
    }
    if (!response.ok) {
      setIsScraping(false);
      toast.error(data.error || "Failed to track product");
      return;
    }
    setIsScraping(false);
    fetchTrackedProducts();
    toast.success("Product tracking started successfully");
  };

  const priceDropped = Array.isArray(trackedProducts)
    ? trackedProducts.filter((product) => product?.alertSent === true).length
    : 0;
  const moneySaved = trackedProducts.reduce((total, product) => {
    if (product.alertSent) {
      console.log("total:", total);
      console.log("product.originalPrice:", product.originalPrice);
      console.log("product.currentPrice:", product.currentPrice);
      return (
        total + (product.originalPrice - product.currentPrice)
      );
    }
    return total;
  }, 0);
  const activeAlerts = trackedProducts.filter(
    (product) => product.isActive === true
  ).length;

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {session?.user.name}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Here's what's happening with your tracked products
            </p>
            <div className="text-xs text-gray-400 mt-1">
              Note: The money saved calculation may include multiple currencies.
            </div>
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
                      {trackedProducts.length}
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
                    <p className="text-2xl font-bold text-green-600">
                      {priceDropped}
                    </p>
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
                    <p className="text-2xl font-bold text-cyan-600">
                      {moneySaved}{" "}
                      {/* <span className="text-xs text-gray-500">
                        (mixed currencies)
                      </span> */}
                    </p>
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
                    <p className="text-2xl font-bold text-orange-600">
                      {activeAlerts}
                    </p>
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
              <div className="text-xs text-gray-400 mt-1">
                Note: Scraping may take a few minutes depending on the network
                and platform.
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 ">
                {["daraz", "ebay", "flipkart"].map((platform) => (
                  <div className="flex items-center" key={platform}>
                    <Input
                      type="radio"
                      name="track-platform"
                      id={`track-${platform}`}
                      value={platform}
                      className="toggle w-auto cursor-pointer"
                      checked={platform === selectedPlatform}
                      onChange={() => setSelectedPlatform(platform)}
                    />
                    <Label className="ml-2" htmlFor={`track-${platform}`}>
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="product-url">Product URL</Label>
                  <Input
                    id="product-url"
                    placeholder="https://www.ebay.com/product-name/dp/..."
                    value={newProductUrl}
                    onChange={(e: any) => setNewProductUrl(e.target.value)}
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
                className="mt-4 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 cursor-pointer"
                disabled={
                  isScraping ||
                  !newProductUrl ||
                  !targetPrice ||
                  !selectedPlatform
                }
              >
                <Plus className="w-4 h-4 mr-2" />
                Start Tracking
                {isScraping && <Loader className="w-4 h-4 ml-2 animate-spin" />}
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
            {trackedProducts.length === 0 ? (
              <CardContent className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No products tracked yet. Start adding products to track their
                  prices!
                </p>
              </CardContent>
            ) : (
              <CardContent>
                <div className="space-y-4">
                  {trackedProducts.slice(0, 3).map((product) => (
                    <div
                      key={product._id}
                      className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <Image
                        src={product.mainImageUrl[0] || "/placeholder.png"}
                        alt={product.title}
                        width={64}
                        height={64}
                        className="w-16 h-16 object-cover rounded-lg"
                        unoptimized={false}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/placeholder.png";
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {product.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className={
                            product.ecommercePlatform === "daraz"
                              ? "bg-orange-400"
                              : product.ecommercePlatform === "ebay"
                              ? "bg-green-400"
                              : "bg-blue-400"
                          }
                        >
                          {product.ecommercePlatform.toUpperCase()}
                        </Badge>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            {product.currency}
                            {product.currentPrice}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Target: {product.currency}
                            {product.desiredPrice}
                          </span>
                          <Badge
                            variant={
                              !product.isActive
                                ? "default"
                                : product.alertSent
                                ? "default"
                                : "secondary"
                            }
                            className={
                              !product.isActive
                                ? "bg-gradient-to-r from-red-500 to-red-600"
                                : product.alertSent
                                ? "bg-gradient-to-r from-green-500 to-green-600"
                                : "bg-gradient-to-r from-indigo-500 to-cyan-500"
                            }
                          >
                            {!product.isActive
                              ? "Stopped"
                              : product.alertSent
                              ? "Price Dropped!"
                              : "Tracking"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link href={product.url} target="_blank">
                          <Button
                            variant="outline"
                            size="sm"
                            className="cursor-pointer"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
