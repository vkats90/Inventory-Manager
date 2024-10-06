import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Order } from '@/types'

interface OrderStatus {
  Created: number
  Ordered: number
  Shipped: number
  Finished: number
}

type OrderStatusKey = keyof OrderStatus

const statusColors = {
  Created: 'bg-blue-500',
  Ordered: 'bg-yellow-500',
  Shipped: 'bg-green-500',
  Finished: 'bg-purple-500',
}

export default function OrderDashboard({
  orderData,
  ordersByStatus,
  highPriorityCreatedOrders,
}: {
  orderData: Order[]
  ordersByStatus: OrderStatus
  highPriorityCreatedOrders: number
}) {
  return (
    <div className="p-2 space-y-6  rounded-lg">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Orders Overview</CardTitle>
          <span className="text-sm text-muted-foreground">Last 30 days</span>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{orderData.length}</div>
          <p className="text-xs text-muted-foreground">Total Orders</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Object.keys(ordersByStatus).map((status) => (
          <Card key={status}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{status}</CardTitle>
              <div className={`w-4 h-4 rounded-full ${statusColors[status as OrderStatusKey]}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ordersByStatus[status as OrderStatusKey]}</div>
              <Progress
                value={(ordersByStatus[status as OrderStatusKey] / orderData.length) * 100}
                className="h-2 mt-2"
                // @ts-ignore
                indicatorClassName={statusColors[status as OrderStatusKey]}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">High Priority Created Orders</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-red-600"
          >
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{highPriorityCreatedOrders}</div>
          <Progress
            value={(highPriorityCreatedOrders / orderData.length) * 100}
            className="h-2 mt-2"
            // @ts-ignore
            indicatorClassName="bg-red-500"
          />
        </CardContent>
      </Card>
    </div>
  )
}
