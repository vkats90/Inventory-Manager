"'use client'"

import { Column } from '@tanstack/react-table'
import { Component, Product, Order } from '../types'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ChevronDown } from 'lucide-react'

interface FilterProps {
  options: Column<Component>[] | Column<Product>[] | Column<Order>[]
}

export function CheckboxDropdownComponent({ options }: FilterProps) {
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
            if (option.id === "'id'") return null
            return (
              <label
                key={option.id}
                className="flex items-center px-4 py-2 text-sm hover:bg-neutral-900/10 hover:text-neutral-900 cursor-pointer dark:hover:bg-neutral-50/10 dark:hover:text-neutral-50"
                role="menuitem"
              >
                <Checkbox
                  id={option.id}
                  checked={option.getIsVisible()}
                  onCheckedChange={option.getToggleVisibilityHandler()}
                  className="mr-2"
                />
                <span>{option.columnDef.header as string}</span>
              </label>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
