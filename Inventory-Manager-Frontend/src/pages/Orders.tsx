import React from "react";
import Card from "../components/card";

// User type (assuming a basic structure, adjust as needed)
type User = {
  id: string;
  name: string;
};

// Order type
type Order = {
  name: string;
  quantity: number;
  priority: number | null;
  status: string | null;
  created_on: string;
  created_by: User;
  updated_on: string;
  updated_by: User | null;
};

// OrderList component
const OrderList: React.FC<{ orders: Order[] }> = ({ orders }) => {
  return (
    <Card>
      <h2 className="text-2xl font-bold mb-4">Order List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Priority</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Created On</th>
              <th className="px-4 py-2">Created By</th>
              <th className="px-4 py-2">Updated On</th>
              <th className="px-4 py-2">Updated By</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={index}
                className="border-b hover:bg-slate-200 cursor-pointer"
              >
                <td className="px-4 py-2">{order.name}</td>
                <td className="px-4 py-2">{order.quantity}</td>
                <td className="px-4 py-2">{order.priority ?? "N/A"}</td>
                <td className="px-4 py-2">{order.status ?? "N/A"}</td>
                <td className="px-4 py-2">
                  {new Date(order.created_on).toLocaleString()}
                </td>
                <td className="px-4 py-2">{order.created_by.name}</td>
                <td className="px-4 py-2">
                  {new Date(order.updated_on).toLocaleString()}
                </td>
                <td className="px-4 py-2">{order.updated_by?.name ?? "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

// Example usage
const exampleOrders: Order[] = [
  {
    name: "Order 1",
    quantity: 5,
    priority: 1,
    status: "Pending",
    created_on: "2023-07-18T10:00:00Z",
    created_by: { id: "1", name: "John Doe" },
    updated_on: "2023-07-18T10:00:00Z",
    updated_by: null,
  },
  {
    name: "Order 2",
    quantity: 10,
    priority: null,
    status: "Completed",
    created_on: "2023-07-17T09:00:00Z",
    created_by: { id: "2", name: "Jane Smith" },
    updated_on: "2023-07-18T11:00:00Z",
    updated_by: { id: "1", name: "John Doe" },
  },
  // Add more orders as needed
];

const OrderPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <OrderList orders={exampleOrders} />
    </div>
  );
};

export default OrderPage;
