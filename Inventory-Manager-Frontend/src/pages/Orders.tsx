import React from "react";
import Card from "../components/card";
import { useNavigate } from "react-router-dom";
import { Order } from "../types";
import { exampleOrders } from "../assets/data/data";

// OrderList component
const OrderList: React.FC<{ orders: Order[] }> = ({ orders }) => {
  const navigate = useNavigate();

  const _handleClick = ({ currentTarget }: React.MouseEvent) => {
    console.log(currentTarget);
    navigate(`/orders/${currentTarget.id}`);
  };

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
            {orders.map((order) => (
              <tr
                key={order.id}
                className={`border-b hover:bg-slate-200 cursor-pointer ${
                  order.status == "Finished" ? "disabled" : ""
                }`}
                id={order.id}
                onClick={_handleClick}
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

const OrderPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <OrderList orders={exampleOrders} />
    </div>
  );
};

export default OrderPage;
