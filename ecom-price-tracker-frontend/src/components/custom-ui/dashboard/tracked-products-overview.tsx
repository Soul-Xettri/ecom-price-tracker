"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  ExternalLink,
  Bot,
  Loader,
  Edit,
  ReceiptEuroIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { useUserStore } from "@/lib/zustand/useUserStore";
import useAuthStore from "@/lib/zustand/authStore";
import { signOut } from "next-auth/react";

export default function TrackedProductOverview() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProductUrl, setNewProductUrl] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("daraz");
  const [isScraping, setIsScraping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [trackedProducts, setTrackedProducts] = useState<any[]>([]);
  const hasFetched = useRef(false);

  const fetchTrackedProducts = async () => {
    const response = await fetch("/api/product/fetch-products", {
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
      toast.error("Failed to fetch tracked products");
      return;
    }
    const data = await response.json();
    setTrackedProducts(data.data.products || []);
    setIsLoading(false);
    toast.success("Tracked products fetched successfully");
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    setIsLoading(true);
    fetchTrackedProducts();
  }, []);

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
    setIsDialogOpen(false);
    fetchTrackedProducts();
    toast.success("Product tracking started successfully");
  };
  

  const TrackedProductCard = ({ product }: { product: any }) => {
    const [localDialogOpen, setLocalDialogOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [stopTrackingInProgress, setStopTrackingInProgress] = useState(false);
    const [localDesiredPrice, setLocalDesiredPrice] = useState(
      product.desiredPrice || ""
    );
    const [updatedDesiredPrice, setUpdatedDesiredPrice] = useState(
      product.desiredPrice || ""
    );
    const [updatedTrackingStatus, setUpdatedTrackingStatus] = useState(
      product.isActive || false
    );

    const handleSave = async () => {
      if (!localDesiredPrice || parseFloat(localDesiredPrice) <= 0) {
        toast.error("Please enter a valid desired price.");
        return;
      }
      setIsUpdating(true);
      const response = await fetch(`/api/product/update-desired-price`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          desiredPrice: parseFloat(localDesiredPrice),
        }),
      });
      const data = await response.json();
      if (response.status === 401 || response.status === 403) {
        setIsUpdating(false);
        useUserStore.getState().logout();
        useAuthStore.getState().logout();
        await signOut({ callbackUrl: "/?session-expired=true" });
        return;
      }
      if (!response.ok) {
        setIsUpdating(false);
        toast.error(data.error || "Failed to update desired price");
        return;
      }
      setUpdatedDesiredPrice(localDesiredPrice);
      setIsUpdating(false);
      toast.success("Desired price updated successfully");
    };

    const handleStopTracking = async () => {
      setStopTrackingInProgress(true);
      const response = await fetch(`/api/product/update-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
        }),
      });
      const data = await response.json();
      if (response.status === 401 || response.status === 403) {
        setStopTrackingInProgress(false);
        useUserStore.getState().logout();
        useAuthStore.getState().logout();
        await signOut({ callbackUrl: "/?session-expired=true" });
        return;
      }
      if (!response.ok) {
        setStopTrackingInProgress(false);
        toast.error(data.error || "Failed to stop tracking");
        return;
      }
      setUpdatedTrackingStatus(data.data.product.isActive);
      setStopTrackingInProgress(false);
      toast.success(
        data.data.message || "Tracking status updated successfully"
      );
    };
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="">
          <div className="flex items-start space-x-4">
            <Image
              src={product.mainImageUrl[0] || "/placeholder.png"}
              alt={product.title}
              width={200}
              height={200}
              className="w-50 h-50 object-cover rounded-lg"
              unoptimized={false}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.png";
              }}
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2" title={product.title}>
                {product.title}
              </h3>
              <div className="flex items-center space-x-2 mb-2">
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
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Tracked Date:
                  </span>
                  <span className="flex items-center">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Original Price:
                  </span>
                  <span className="font-bold text-lg text-gray-900 dark:text-white flex items-center">
                    <span
                      className={
                        product.discountPrice
                          ? "line-through text-gray-400"
                          : ""
                      }
                    >
                      {product.currency}
                      {product.originalPrice}
                      {typeof product.originalDecimal === "number" &&
                        product.originalDecimal > 0 && (
                          <span>
                            .
                            {product.originalDecimal
                              .toString()
                              .padStart(2, "0")}
                          </span>
                        )}
                    </span>
                    {product.discountPrice && (
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                        {product.discountPrice}
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Current Price:
                  </span>
                  <span className="font-bold text-lg text-gray-900 dark:text-white">
                    {product.currency}
                    {product.currentPrice}
                    {typeof product.currentDecimal === "number" &&
                      product.currentDecimal > 0 && (
                        <span>
                          .{product.currentDecimal.toString().padStart(2, "0")}
                        </span>
                      )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Target Price:
                  </span>
                  <span className="font-medium text-indigo-600">
                    {product.currency}
                    {updatedDesiredPrice}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link href={product.url} target="_blank" className="cursor-pointer">
              <Button variant="outline" size="sm" className="cursor-pointer">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Product
              </Button>
            </Link>
            <Dialog open={localDialogOpen} onOpenChange={setLocalDialogOpen}>
              <DialogTrigger
                onClick={(event) => event.stopPropagation()}
                asChild
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-500 hover:text-blue-700 bg-transparent cursor-pointer"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Product
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <div className="flex gap-4 items-center">
                    <div className="flex h-[48px] w-[48px] p-[12px] border rounded-[10px] justify-center items-center">
                      <Edit />
                    </div>
                    <div>
                      <DialogTitle className="text-[18px] leading-5 text-secondary-foreground font-[500]">
                        Edit Tracking Configurations
                      </DialogTitle>

                      <DialogDescription className="font-[400] text-[14px] text-gray-500">
                        {product.title}
                      </DialogDescription>
                    </div>
                  </div>
                  {product.alertSent && (
                    <div className="text-xs text-gray-400 mt-1">
                      Note: This product has already sent an alert for a price
                      drop which means you cannot change the target price or
                      tracking status.
                    </div>
                  )}
                </DialogHeader>
                <hr />
                <form>
                  <div className="grid gap-4 py-4">
                    <div className="flex flex-col gap-2">
                      <Label>Target Price ($)</Label>
                      <Input
                        type="number"
                        value={localDesiredPrice}
                        onChange={(e) => setLocalDesiredPrice(e.target.value)}
                        className="h-[45px] text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button
                      type="button"
                      onClick={handleSave}
                      disabled={
                        isUpdating ||
                        stopTrackingInProgress ||
                        product.alertSent
                      }
                      className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 cursor-pointer"
                    >
                      Save Settings
                      {isUpdating && (
                        <Loader className="w-4 h-4 ml-2 animate-spin" />
                      )}
                    </Button>
                    {updatedTrackingStatus ? (
                      <Button
                        type="button"
                        onClick={handleStopTracking}
                        disabled={
                          stopTrackingInProgress ||
                          isUpdating ||
                          product.alertSent
                        }
                        className="
                                            bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700
                                            cursor-pointer"
                      >
                        Stop Tracking
                        {stopTrackingInProgress && (
                          <Loader className="w-4 h-4 ml-2 animate-spin" />
                        )}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={handleStopTracking}
                        disabled={stopTrackingInProgress || isUpdating}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 cursor-pointer"
                      >
                        Start Tracking
                        {stopTrackingInProgress && (
                          <Loader className="w-4 h-4 ml-2 animate-spin" />
                        )}
                      </Button>
                    )}
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
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Tracked Products
            </h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger
                onClick={(event) => event.stopPropagation()}
                asChild
              >
                <Button className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 cursor-pointer">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <div className="flex gap-4 items-center">
                    <div className="flex h-[48px] w-[48px] p-[12px] border rounded-[10px] justify-center items-center">
                      <Bot />
                    </div>
                    <div>
                      <DialogTitle className="text-[18px] leading-5 text-secondary-foreground font-[500]">
                        Add New Product to Track
                      </DialogTitle>

                      <DialogDescription className="font-[400] text-[14px] text-gray-500">
                        Paste a product URL from Ebay, Daraz, or Flipkart to
                        start tracking
                      </DialogDescription>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Note: Scraping may take a few minutes depending on the
                    network and platform.
                  </div>
                </DialogHeader>
                <hr />
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
                  {isScraping && (
                    <Loader className="w-4 h-4 ml-2 animate-spin" />
                  )}
                </Button>
              </DialogContent>
            </Dialog>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader className="w-6 h-6 mx-auto my-4 animate-spin" />
            </div>
          ) : trackedProducts.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {trackedProducts.map((product) => (
                <TrackedProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              No tracked products found. Start tracking products to see them
              here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
