'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useWorkerStore } from '@/store/workerStore'
import { ShiftClock } from '@/components/ShiftClock'
import { Clock, AlertCircle, CheckCircle } from 'lucide-react'
import { formatDate } from 'date-fns'

export default function DashboardPage() {
  const router = useRouter()
  const { worker, checkAuth, getCurrentShift, getShifts, shifts } = useWorkerStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (!worker) {
      router.push('/login')
    } else {
      getCurrentShift()
      getShifts()
    }
  }, [worker, router, getCurrentShift, getShifts])

  if (!worker) {
    return null
  }

  const upcomingShifts = shifts.filter(s => s.status === 'pending').slice(0, 3)
  const todayHours = shifts
    .filter(s => s.status === 'completed' && new Date(s.date).toDateString() === new Date().toDateString())
    .reduce((acc, s) => acc + (s.hoursWorked || 0), 0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {worker.name}</h1>
        <p className="text-gray-600 mt-2">Worker ID: {worker.workerId}</p>
      </div>

      {/* Time Clock */}
      <div className="mb-8">
        <ShiftClock />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Today's Hours */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Today's Hours</h3>
            <Clock className="text-grenrose-600" size={24} />
          </div>
          <p className="text-3xl font-bold text-gray-900">{todayHours.toFixed(1)}h</p>
          <p className="text-sm text-gray-500 mt-2">Hours worked today</p>
        </div>

        {/* Department */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Department</h3>
            <CheckCircle className="text-blue-600" size={24} />
          </div>
          <p className="text-2xl font-bold text-gray-900">{worker.department}</p>
          <p className="text-sm text-gray-500 mt-2">Your assigned department</p>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Contact</h3>
            <AlertCircle className="text-green-600" size={24} />
          </div>
          <p className="text-sm font-mono text-gray-900 break-all">{worker.phone}</p>
          <p className="text-sm text-gray-500 mt-2">Your phone number</p>
        </div>
      </div>

      {/* Upcoming Shifts */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Shifts</h2>
        {upcomingShifts.length > 0 ? (
          <div className="space-y-4">
            {upcomingShifts.map((shift) => (
              <div key={shift.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">
                    {formatDate(new Date(shift.date), 'EEEE, MMMM d')}
                  </p>
                  <p className="text-sm text-gray-600">
                    {shift.startTime} - {shift.endTime}
                  </p>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                  Pending
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No upcoming shifts scheduled</p>
        )}
      </div>
    </div>
  )
}
