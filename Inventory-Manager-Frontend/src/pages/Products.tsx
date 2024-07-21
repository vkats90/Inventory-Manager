import React from "react";
import Card from "../components/card";
import { useNavigate } from "react-router-dom";
import { Product } from "../types";
import { exampleProducts } from "../assets/data/data";

export const ProductList: React.FC<{ products: Product[] }> = ({
  products,
}) => {
  const navigate = useNavigate();

  const _handleClick = ({ currentTarget }: React.MouseEvent) => {
    console.log(currentTarget);
    navigate(`/products/${currentTarget.id}`);
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-4">Product List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">SKU</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Cost</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Components</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                id={product.id}
                className="border-b hover:bg-slate-200 cursor-pointer"
                onClick={_handleClick}
              >
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">{product.SKU}</td>
                <td className="px-4 py-2">{product.stock}</td>
                <td className="px-4 py-2">
                  {product.cost !== null
                    ? `$${product.cost.toFixed(2)}`
                    : "N/A"}
                </td>
                <td className="px-4 py-2">
                  {product.price !== null
                    ? `$${product.price.toFixed(2)}`
                    : "N/A"}
                </td>
                <td className="px-4 py-2">
                  {product.components
                    ? product.components.map((c) => c.name).join(", ")
                    : "None"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

const ProductPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <ProductList products={exampleProducts} />
    </div>
  );
};

export default ProductPage;
