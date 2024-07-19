import React, { useState } from "react";
// import { useParams } from 'react-router-dom';
import Card from "../components/card";

// Component type
type Component = {
  name: string;
  stock: number;
  cost: number | null;
  id: string;
};

// Static component data
const initialComponentData: Component = {
  id: "1",
  name: "Example Component",
  stock: 500,
  cost: 5.25,
};

const SingleComponentPage: React.FC = () => {
  //   const { name } = useParams<{ name: string }>();
  const [component, setComponent] = useState<Component>(initialComponentData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setComponent((prev) => ({
      ...prev,
      [name]:
        name === "stock"
          ? parseInt(value)
          : name === "cost"
          ? parseFloat(value)
          : value,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <input
          className="text-3xl font-bold mb-4 w-full"
          value={component.name}
          onChange={handleInputChange}
          name="name"
        />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">ID:</label>
            <input
              className="w-full mt-1 p-2 border rounded bg-gray-100"
              value={component.id}
              readOnly
            />
          </div>
          <div>
            <label className="font-semibold">Stock:</label>
            <input
              className="w-full mt-1 p-2 border rounded"
              type="number"
              step="1"
              value={component.stock}
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
              value={component.cost ?? ""}
              onChange={handleInputChange}
              name="cost"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SingleComponentPage;
