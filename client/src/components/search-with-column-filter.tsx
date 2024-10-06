'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Column } from '@tanstack/react-table'
import { Component, Product, Order } from '../types'
import { ComparisonOperator } from '@/utils/compare'
import { CalendarIcon } from '@radix-ui/react-icons'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface FilterProps {
  columns: Column<Component>[] | Column<Product>[] | Column<Order>[]
  onSearch: (query: string, column: string) => void
  setOperator: (operator: ComparisonOperator) => void
}

const SearchWithColumnFilter: React.FC<FilterProps> = ({ columns, onSearch, setOperator }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedColumn, setSelectedColumn] = useState('all')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectOperator, setSelectOperator] = useState<ComparisonOperator>('eq')

  const handleOperatorChange = (value: string) => {
    setSelectOperator(value as ComparisonOperator)
    setOperator(value as ComparisonOperator)
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
    onSearch(event.target.value, selectedColumn)
  }

  const handleColumnChange = (value: string) => {
    setSelectedColumn(value)
    if (value !== 'created_on' && value !== 'updated_on') {
      setSelectedDate(null)
    }
  }

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date || null)

    onSearch(date ? date.valueOf().toString() : '', selectedColumn)
  }

  return (
    <div className="w-1/2 max-w-lg mx-auto space-y-4 mb-4">
      <div className="flex flex-col sm:flex-row gap-1">
        <div className="flex-grow">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          {selectedColumn === 'created_on' || selectedColumn === 'updated_on' ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full pl-3 text-left font-normal',
                    !selectedDate && 'text-muted-foreground'
                  )}
                >
                  {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate || undefined}
                  onSelect={handleDateChange}
                  disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                  initialFocus
                />
                <Button variant="link" onClick={() => handleDateChange(undefined)}>
                  Clear
                </Button>
              </PopoverContent>
            </Popover>
          ) : (
            <Input
              id="search"
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full"
            />
          )}
        </div>
        <div className="w-1/4">
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
        {['stock', 'cost', 'price', 'created_on', 'updated_on', 'quantity', 'priority'].includes(
          selectedColumn
        ) && (
          <div className="w-1/2">
            <Select value={selectOperator} onValueChange={handleOperatorChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select operator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eq">Equals</SelectItem>
                <SelectItem value="ne">Not Equals</SelectItem>
                <SelectItem value="gt">Greater Than</SelectItem>
                <SelectItem value="lt">Less Than</SelectItem>
                <SelectItem value="gte">Greater Than or Equals</SelectItem>
                <SelectItem value="lte">Less Than or Equals</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      <div className="text-sm text-gray-500 text-center">
        Searching in: <span className="font-medium">{selectedColumn}</span>
        {searchQuery && (
          <>
            {' '}
            for: <span className="font-medium">"{searchQuery}"</span>
          </>
        )}
        {selectedDate && (
          <>
            {' '}
            for: <span className="font-medium">{format(selectedDate, 'PPP')}</span>
          </>
        )}
      </div>
    </div>
  )
}

export default SearchWithColumnFilter
