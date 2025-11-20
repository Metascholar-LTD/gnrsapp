import React, { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { ChevronDownIcon, X } from "lucide-react"

type TSelectData = {
  id: string
  label: string
  value: string
  description?: string
  icon?: string
  disabled?: boolean
  custom?: React.ReactNode
}

type SelectProps = {
  data?: TSelectData[]
  onChange?: (value: string) => void
  defaultValue?: string
  id?: string
}

const AnimatedSelect = ({ data, defaultValue, onChange, id }: SelectProps) => {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState<TSelectData | undefined>(undefined)
  const uniqueId = id || `select-${Math.random().toString(36).substr(2, 9)}`

  // Initialize selected value
  useEffect(() => {
    if (defaultValue && data) {
      const item = data.find((i) => i.value === defaultValue)
      if (item) {
        setSelected(item)
      }
    } else if (data && data.length > 0) {
      setSelected(data[0])
    }
  }, [defaultValue, data])

  // Handle click outside - SIMPLE AND RELIABLE
  useEffect(() => {
    if (!open) return

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node
      
      // If click is inside the container, do nothing
      if (containerRef.current && containerRef.current.contains(target)) {
        return
      }
      
      // Click is outside - close dropdown
      setOpen(false)
    }

    // Use click event (not mousedown) and add after current event loop
    setTimeout(() => {
      window.addEventListener('click', handleClick, true)
    }, 0)

    return () => {
      window.removeEventListener('click', handleClick, true)
    }
  }, [open])

  const handleSelect = (value: string) => {
    const item = data?.find((i) => i.value === value)
    if (item) {
      setSelected(item)
      onChange?.(value)
      setOpen(false)
    }
  }

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setOpen(prev => !prev)
  }

  if (!data || data.length === 0) {
    return null
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full" 
      data-dropdown-id={uniqueId}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Trigger Button - Always visible */}
      <motion.div
        whileTap={{ scale: 0.98 }}
        animate={{ borderRadius: 30 }}
        onClick={handleToggle}
        className="overflow-hidden rounded-[30px] border-2 border-slate-300 bg-white shadow-sm w-full cursor-pointer hover:border-slate-400 transition-colors min-h-[48px]"
      >
        <div className="flex items-center justify-between gap-2 px-4 py-3">
          <span className="text-sm font-semibold text-slate-900 flex-1">
            {selected?.label || "Select an option"}
          </span>
          <ChevronDownIcon 
            className={`text-slate-600 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} 
            size={20} 
          />
        </div>
      </motion.div>

      {/* Dropdown Menu - Absolute positioned OVER content */}
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 5 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 right-0 mt-2 overflow-hidden rounded-[20px] border-2 border-slate-300 bg-white shadow-2xl z-[1000]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <strong className="text-slate-900 font-semibold">
              {selected?.label || "Choose Option"}
            </strong>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setOpen(false)
              }}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 transition-colors"
            >
              <X className="text-slate-700" size={12} />
            </button>
          </div>

          {/* Options List */}
          <div className="w-full overflow-y-auto max-h-[400px]">
            {data.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03, duration: 0.2 }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleSelect(item.value)
                }}
                className="flex cursor-pointer items-start gap-3 p-4 hover:bg-slate-100 transition-colors border-b border-slate-50 last:border-b-0"
              >
                <div className="flex flex-col flex-1 min-w-0">
                  <strong className="text-sm font-semibold text-slate-900 break-words">
                    {item.label}
                  </strong>
                  {item.description && (
                    <span className="text-xs text-slate-600 break-words mt-1">
                      {item.description}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default AnimatedSelect
