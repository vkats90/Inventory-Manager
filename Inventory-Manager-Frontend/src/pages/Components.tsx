import React from "react";
import Card from "../components/card";

// Component type
type Component = {
  name: string;
  stock: number;
  cost: number | null;
  id: string;
};

// ComponentList component
const ComponentList: React.FC<{ components: Component[] }> = ({
  components,
}) => {
  return (
    <Card>
      <h2 className="text-2xl font-bold mb-4">Component List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Cost</th>
            </tr>
          </thead>
          <tbody>
            {components.map((component) => (
              <tr
                key={component.id}
                className="border-b hover:bg-slate-200 cursor-pointer"
              >
                <td className="px-4 py-2">{component.name}</td>
                <td className="px-4 py-2">{component.stock.toFixed(2)}</td>
                <td className="px-4 py-2">
                  {component.cost !== null
                    ? `$${component.cost.toFixed(2)}`
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

// Example usage
const exampleComponents: Component[] = [
  {
    id: "1",
    name: "Component A",
    stock: 100.5,
    cost: 5.25,
  },
  {
    id: "2",
    name: "Component B",
    stock: 50.0,
    cost: null,
  },
  // Add more components as needed
];

const ComponentPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <ComponentList components={exampleComponents} />
    </div>
  );
};

export default ComponentPage;
