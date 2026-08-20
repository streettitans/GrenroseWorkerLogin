'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, Menu, X } from 'lucide-react'
import { useWorkerStore } from '@/store/workerStore'
import { useState } from 'react'

export function Navbar() {
  const router = useRouter()
  const { worker, logout } = useWorkerStore()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (!worker) return null

  return (
    <nav className="bg-grenrose-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg"></div>
            <span className="font-bold text-xl">Grenrose</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard" className="hover:text-grenrose-100 transition">
              Dashboard
            </Link>
            <Link href="/shifts" className="hover:text-grenrose-100 transition">
              My Shifts
            </Link>
            <Link href="/timesheets" className="hover:text-grenrose-100 transition">
              Timesheets
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline text-sm">{worker.name}</span>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-grenrose-700 rounded-lg transition"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
            <button
              className="md:hidden p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/dashboard"
              className="block px-4 py-2 hover:bg-grenrose-700 rounded"
            >
              Dashboard
            </Link>
            <Link
              href="/shifts"
              className="block px-4 py-2 hover:bg-grenrose-700 rounded"
            >
              My Shifts
            </Link>
            <Link
              href="/timesheets"
              className="block px-4 py-2 hover:bg-grenrose-700 rounded"
            >
              Timesheets
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
