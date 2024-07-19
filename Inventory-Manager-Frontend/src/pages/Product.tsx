import React, { useState } from "react";
// import { useParams } from 'react-router-dom';
import Card from "../components/card";

// Product type
type Product = {
  name: string;
  stock: number;
  cost: number | null;
  price: number | null;
  SKU: string;
  components: { name: string }[] | null;
  id: string;
};

// Static product data
const initialProductData: Product = {
  id: "1",
  name: "Example Product",
  stock: 100,
  cost: 10.5,
  price: 19.99,
  SKU: "EP001",
  components: [{ name: "Component A" }, { name: "Component B" }],
};

const SingleProductPage: React.FC = () => {
  //   const { name } = useParams<{ name: string }>();
  const [product, setProduct] = useState<Product>(initialProductData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <input
          className="text-3xl font-bold mb-4 w-full"
          value={product.name}
          onChange={handleInputChange}
          name="name"
        />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">SKU:</label>
            <input
              className="w-full mt-1 p-2 border rounded"
              value={product.SKU}
              onChange={handleInputChange}
              name="SKU"
            />
          </div>
          <div>
            <label className="font-semibold">Stock:</label>
            <input
              className="w-full mt-1 p-2 border rounded"
              type="number"
              value={product.stock}
              onChange={handleInputChange}
              name="stock"
            />
          </div>
          <div>
            <label className="font-semibold">Cost:</label>
            <input
              className="w-full mt-1 p-2 border rounded"
              type="number"
              step="0.01"
              value={product.cost ?? ""}
              onChange={handleInputChange}
              name="cost"
            />
          </div>
          <div>
            <label className="font-semibold">Price:</label>
            <input
              className="w-full mt-1 p-2 border rounded"
              type="number"
              step="0.01"
              value={product.price ?? ""}
              onChange={handleInputChange}
              name="price"
            />
          </div>
        </div>
        {product.components && product.components.length > 0 && (
          <div className="mt-4">
            <p className="font-semibold">Components:</p>
            <ul className="list-disc list-inside">
              {product.components.map((component, index) => (
                <li key={index}>{component.name}</li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SingleProductPage;
