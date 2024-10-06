import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Package, AlertTriangle } from 'lucide-react'

interface ProductData {
  totalParts: number
  lowStockParts: number
}

export default function PartsDashboard({ totalParts, lowStockParts }: ProductData) {
  return (
    <div className="p-2 space-y-6  rounded-lg">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Parts Overview</CardTitle>
          <Package className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{totalParts}</div>
          <p className="text-xs text-muted-foreground">Total Parts</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Parts</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalParts}</div>
            <Progress value={100} className="h-2 mt-2" indicatorClassName="bg-blue-500" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parts with Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockParts}</div>
            <Progress
              value={(lowStockParts / totalParts) * 100}
              className="h-2 mt-2"
              indicatorClassName="bg-yellow-500"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Stock Level Overview</CardTitle>
          <div className="flex space-x-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
              <span className="text-xs">In Stock</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
              <span className="text-xs">Low Stock</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-green-200 rounded-full h-4">
              <div
                className="bg-green-500 h-4 rounded-full"
                style={{
                  width: `${((totalParts - lowStockParts) / totalParts) * 100}%`,
                }}
              ></div>
            </div>
            <div className="flex-1 bg-yellow-200 rounded-full h-4">
              <div
                className="bg-yellow-500 h-4 rounded-full"
                style={{
                  width: `${(lowStockParts / totalParts) * 100}%`,
                }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span>{totalParts - lowStockParts} In Stock</span>
            <span>{lowStockParts} Low Stock</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
