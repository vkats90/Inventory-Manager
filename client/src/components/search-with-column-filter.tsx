'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Column } from '@tanstack/react-table'
import { Component, Product, Order } from '../types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface FilterProps {
  columns: Column<Component>[] | Column<Product>[] | Column<Order>[]
  onSearch: (query: string, column: string) => void
}

const SearchWithColumnFilter: React.FC<FilterProps> = ({ columns, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedColumn, setSelectedColumn] = useState('all')

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
    onSearch(event.target.value, selectedColumn)
  }

  const handleColumnChange = (value: string) => {
    setSelectedColumn(value)
  }

  return (
    <div className="w-1/4 max-w-lg mx-auto space-y-4 mb-4">
      <div className="flex flex-col sm:flex-row gap-1">
        <div className="flex-grow">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <Input
            id="search"
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full"
          />
        </div>
        <div className="w-1/3">
          <Select value={selectedColumn} onValueChange={handleColumnChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select column" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {columns.map((column) => {
                if (column.id === 'id' || column.id === 'image') return null
                return (
                  <SelectItem key={column.id} value={column.id}>
                    {column.columnDef.header as string}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="text-sm text-gray-500 text-center">
        Searching in: <span className="font-medium">{selectedColumn}</span>
        {searchQuery && (
          <>
            {' '}
            for: <span className="font-medium">"{searchQuery}"</span>
          </>
        )}
      </div>
    </div>
  )
}

export default SearchWithColumnFilter
