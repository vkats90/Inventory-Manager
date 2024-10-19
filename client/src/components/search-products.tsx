'use client'

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package, Cog, Plus } from 'lucide-react'

interface Item {
  id: string
  name: string
  stock: number
  type: 'product' | 'component'
  quantity?: number
}

interface SearchProductsProps {
  products: Omit<Item, 'type'>[]
  components: Omit<Item, 'type'>[]
  selectedItems: Item[]
  setSelectedItems: React.Dispatch<React.SetStateAction<Item[]>>
}

export default function SearchProductsComponents({
  products,
  components,
  selectedItems,
  setSelectedItems,
}: SearchProductsProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [matchedItems, setMatchedItems] = useState<Item[]>([])

  useEffect(() => {
    if (searchTerm) {
      const filteredProducts = products
        .filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((product) => ({ ...product, type: 'product' as const }))
        .slice(0, 5) // Limit to top 5 matches

      const filteredComponents = components
        .filter((component) => component.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((component) => ({ ...component, type: 'component' as const }))
        .slice(0, 5) // Limit to top 5 matches

      setMatchedItems([...filteredProducts, ...filteredComponents])
    } else {
      setMatchedItems([])
    }
  }, [searchTerm, products, components])

  const handleSelectItem = (item: Item) => {
    if (!selectedItems.some((selectedItem) => selectedItem.id === item.id)) {
      setSelectedItems((prevItems) => [...prevItems, item])
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <Input
        type="text"
        placeholder="Search products or components..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
      />

      {matchedItems.length > 0 && (
        <Card>
          <CardContent className="py-2">
            <ul className="">
              {matchedItems.map((item) => (
                <li key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    {item.type === 'product' ? (
                      <Package className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Cog className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Stock: {item.stock}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleSelectItem(item)}
                      disabled={selectedItems.some((selectedItem) => selectedItem.id === item.id)}
                    >
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">Add {item.name}</span>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
