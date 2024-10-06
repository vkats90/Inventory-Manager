import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Package,
  Truck,
  ShoppingCart,
  AlertTriangle,
  TrendingUp,
  Clock,
  Hammer,
} from 'lucide-react'

interface RecommendationProps {
  orderData: {
    totalOrders: number
    highPriorityOrders: number
  }
  productData: {
    totalProducts: number
    lowStockProducts: number
  }
  partData: {
    totalParts: number
    lowStockParts: number
  }
}

export function RecommendationCardComponent({
  orderData,
  productData,
  partData,
}: RecommendationProps) {
  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="orders">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="parts">Parts</TabsTrigger>
          </TabsList>
          <TabsContent value="orders" className="space-y-4 mt-4">
            <div className="flex items-start space-x-2">
              <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Process High Priority Orders</h4>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  You have {orderData.highPriorityOrders} high priority orders. Process these first
                  to ensure timely delivery.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Analyze Order Trends</h4>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Review the patterns in your {orderData.totalOrders} orders to optimize inventory
                  and improve customer satisfaction.
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="products" className="space-y-4 mt-4">
            <div className="flex items-start space-x-2">
              <Truck className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Restock Low Inventory</h4>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Consider restocking {productData.lowStockProducts} products that are currently low
                  in stock to avoid potential stockouts.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <ShoppingCart className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Analyze Product Performance</h4>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Review the sales data for your {productData.totalProducts} products to identify
                  top performers and potential areas for improvement.
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="parts" className="space-y-4 mt-4">
            <div className="flex items-start space-x-2">
              <Hammer className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Replenish Low Stock Parts</h4>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {partData.lowStockParts} parts are running low. Reorder these parts to maintain
                  smooth production.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Package className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Optimize Part Inventory</h4>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Analyze usage patterns of all {partData.totalParts} parts to optimize your
                  inventory levels and reduce carrying costs.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium">Overall Recommendation</h4>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Focus on processing high-priority orders, restocking low inventory products, and
                replenishing low-stock parts to maintain operational efficiency.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
