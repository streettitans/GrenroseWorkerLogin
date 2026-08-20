'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useWorkerStore } from '@/store/workerStore'
import { Calendar, Clock, CheckCircle } from 'lucide-react'
import { formatDate } from 'date-fns'

export default function ShiftsPage() {
  const router = useRouter()
  const { worker, shifts, getShifts } = useWorkerStore()

  useEffect(() => {
    if (!worker) {
      router.push('/login')
    } else {
      getShifts()
    }
  }, [worker, router, getShifts])

  if (!worker) return null

  const pendingShifts = shifts.filter(s => s.status === 'pending')
  const completedShifts = shifts.filter(s => s.status === 'completed')

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
      completed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Completed' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
    }
    const config = statusMap[status] || statusMap.pending
    return (
      <span className={`px-3 py-1 ${config.bg} ${config.text} rounded-full text-xs font-medium`}>
        {config.label}
      </span>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Shifts</h1>
        <p className="text-gray-600 mt-2">View and manage your work shifts</p>
      </div>

      {/* Pending Shifts */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar size={24} className="text-grenrose-600" />
          Upcoming Shifts
        </h2>
        {pendingShifts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Start</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">End</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pendingShifts.map((shift) => (
                  <tr key={shift.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatDate(new Date(shift.date), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{shift.startTime}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{shift.endTime}</td>
                    <td className="px-4 py-3 text-sm">{getStatusBadge(shift.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No upcoming shifts</p>
        )}
      </div>

      {/* Completed Shifts */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle size={24} className="text-blue-600" />
          Completed Shifts
        </h2>
        {completedShifts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Start</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">End</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Hours</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {completedShifts.map((shift) => (
                  <tr key={shift.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatDate(new Date(shift.date), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{shift.startTime}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{shift.endTime}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {shift.hoursWorked?.toFixed(1)}h
                    </td>
                    <td className="px-4 py-3 text-sm">{getStatusBadge(shift.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No completed shifts</p>
        )}
      </div>
    </div>
  )
}
