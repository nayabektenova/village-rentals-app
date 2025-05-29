'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const pathname = usePathname()
  const [showDropdown, setShowDropdown] = useState(false)

  const isActive = (path: string) =>
    pathname === path
      ? 'text-white font-semibold underline'
      : 'text-white hover:underline'

  return (
    <div className="bg-[#3F3751] text-white px-6 py-5 shadow-md flex items-center justify-between">
      <h1 className="text-2xl font-bold tracking-wide">Village Rental System</h1>

      <div className="flex gap-6 text-sm items-center relative">
        <Link href="/customers">
          <span className={`${isActive('/customers')} cursor-pointer`}>
            Manage Customers
          </span>
        </Link>

        {/* Dropdown for Manage Equipment */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1 cursor-pointer text-white hover:underline"
          >
            Manage Equipment <ChevronDown size={16} />
          </button>

          {showDropdown && (
            <div
              className="absolute top-full mt-2 left-0 w-48 rounded-lg bg-white text-gray-900 shadow-lg border border-gray-200 z-50 transition-all"
              onMouseLeave={() => setShowDropdown(false)}
            >
              <Link href="/equipment">
                <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Equipment List</div>
              </Link>
              <Link href="/categories">
                <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Category List</div>
              </Link>
            </div>
          )}
        </div>

        <Link href="/rentals">
          <span className={`${isActive('/rentals')} cursor-pointer`}>
            Equipment Rental
          </span>
        </Link>
      </div>
    </div>
  )
}
