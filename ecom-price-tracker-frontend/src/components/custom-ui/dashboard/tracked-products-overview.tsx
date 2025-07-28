"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { trackedProducts } from "@/utils/dummyData";

export default function TrackedProductOverview() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Tracked Products
            </h1>
            <Button className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {trackedProducts.map((product) => (
              <Card
                key={product.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline">{product.platform}</Badge>
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
                      <div className="space-y-1">
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
                            ${product.targetPrice}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Product
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-700 bg-transparent"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
