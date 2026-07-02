"use client"

import { useEffect, useState } from "react"
import { AppButton } from "./button"
import { cn } from "../lib/utils"

interface CategorySelectorProps {
  items: string[]
  className?: string
  selectedItem?: string
  onSelect?: (item: string) => void
}

export function CategorySelector({ 
  items,
  className,
  selectedItem,
  onSelect 
}: CategorySelectorProps) {
  const [selected, setSelected] = useState<string | undefined>(selectedItem)
  const [size, setSize] = useState<"sm" | "lg">("sm")

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSize("sm")
      } else {
        setSize("lg")
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleSelect = (item: string) => {
    if (selected === item) {
      setSelected(undefined);
      if (onSelect) {
        onSelect("");
      }
      return;
    }
    
    setSelected(item);
    if (onSelect) {
      onSelect(item);
    }
  };

  return (
    <div className={cn([className], 'flex gap-1')}>
      {items.map((item) => (
          <AppButton
              key={item}
              size={size}
              tone={selected === item ? "primary" : "secondary"}
              onClick={() => handleSelect(item)}
              className=""
          >
              {item}
          </AppButton>
      ))}
    </div>
  )
}
