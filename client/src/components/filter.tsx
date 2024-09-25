'use client'

import { Column } from '@tanstack/react-table'
import { Component, Product, Order } from '../types'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'

interface FilterProps {
  options: Column<Component>[] | Column<Product>[] | Column<Order>[]
}

export default function CheckboxDropdown({ options }: FilterProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[120px] justify-between">
          Filter
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0">
        <div
          className="py-1"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          {options.map((option) => {
            if (option.id === 'id' || option.id === 'image') return null
            return (
              <label
                key={option.id}
                className="flex items-center px-4 py-2 text-s text-gray-700 hover:bg-primary/20 hover:text-gray-900 accent-primary"
                role="menuitem"
              >
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4"
                  checked={option.getIsVisible()}
                  onChange={option.getToggleVisibilityHandler()}
                />
                <span className="ml-2">{option.columnDef.header as string}</span>
              </label>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
