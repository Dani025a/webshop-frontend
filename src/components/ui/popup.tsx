'use client'

import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface PopupProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function Popup({ isOpen, onClose, title, children, footer }: PopupProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isVisible) return null

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="w-full max-w-md z-10 bg-white border border-gray-200 rounded-lg shadow-lg">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight text-blue-600">{title}</h3>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-gray-100 h-9 w-9 text-gray-600"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <div className="p-6 pt-0 text-gray-700">{children}</div>
        {footer && <div className="flex items-center p-6 pt-0">{footer}</div>}
      </div>
    </div>
  )
}

