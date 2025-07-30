"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, ExternalLink, Bot, Loader, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

export default function TrackedProductOverview() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newProductUrl, setNewProductUrl] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("daraz");
  const [isScraping, setIsScraping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [trackedProducts, setTrackedProducts] = useState<any[]>([]);

  const fetchTrackedProducts = async () => {
    const response = await fetch("/api/product/fetch-products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
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
    setIsLoading(true);
    fetchTrackedProducts();
  }, []);

  const handleAddProduct = async () => {
    if (!newProductUrl || !targetPrice || !selectedPlatform) {
      toast.error("Please fill in all fields.");
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
    console.log("Scrape response:", response.ok);
    if (!response.ok) {
      setIsScraping(false);
      toast.error(data.error || "Failed to track product");
      return;
    }
    setIsScraping(false);
    setIsDialogOpen(false);
    setIsLoading(true);
    fetchTrackedProducts();
    toast.success("Product tracking started successfully");
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
                      <DialogTitle className="hidden">
                        Add New Product to Track
                      </DialogTitle>
                      <div className="text-[18px] leading-5 text-secondary-foreground font-[500]">
                        Add New Product to Track
                      </div>
                      <div className="font-[400] text-[14px] text-gray-500">
                        Paste a product URL from Amazon, Daraz, or Flipkart to
                        start tracking
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Note: Scraping may take a few minutes depending on the
                    network and product.
                  </div>
                </DialogHeader>
                <hr />
                <div className="grid grid-cols-1 md:grid-cols-3 ">
                  {["daraz", "amazon", "flipkart"].map((platform) => (
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
                      placeholder="https://www.amazon.com/product-name/dp/..."
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
                <Card
                  key={product.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Image
                        src={product.mainImageUrl[0] || "/placeholder.svg"}
                        alt={product.title}
                        width={200}
                        height={200}
                        className="w-50 h-50 object-cover rounded-lg"
                        unoptimized={false}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/placeholder.svg";
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          {product.title}
                        </h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge
                            variant="outline"
                            className={
                              product.ecommercePlatform === "daraz"
                                ? "bg-orange-400"
                                : ""
                            }
                          >
                            {product.ecommercePlatform}
                          </Badge>
                          <Badge
                            variant={
                              product.alertSent ? "default" : "secondary"
                            }
                            className={
                              product.alertSent
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-gradient-to-r from-indigo-500 to-cyan-500"
                            }
                          >
                            {product.alertSent ? "Price Dropped!" : "Tracking"}
                          </Badge>
                        </div>
                        <div className="space-y-1">
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
                                ${product.originalPrice}
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
                              ${product.currentPrice}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Target Price:
                            </span>
                            <span className="font-medium text-indigo-600">
                              ${product.desiredPrice}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Link
                        href={product.url}
                        target="_blank"
                        className="cursor-pointer"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Product
                        </Button>
                      </Link>
                      <Dialog
                        open={isEditDialogOpen}
                        onOpenChange={setIsEditDialogOpen}
                      >
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
                                <Bot />
                              </div>
                              <div>
                                <DialogTitle className="hidden">
                                  Add New Product to Track
                                </DialogTitle>
                                <div className="text-[18px] leading-5 text-secondary-foreground font-[500]">
                                  Add New Product to Track
                                </div>
                                <div className="font-[400] text-[14px] text-gray-500">
                                  Paste a product URL from Amazon, Daraz, or
                                  Flipkart to start tracking
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              Note: Scraping may take a few minutes depending on
                              the network and product.
                            </div>
                          </DialogHeader>
                          <hr />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
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
