'use client'

import { useEffect, useState } from 'react'
import { Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { useWorkerStore } from '@/store/workerStore'
import { formatDistanceToNow } from 'date-fns'

export function ShiftClock() {
  const { currentShift, clockIn, clockOut, isLoading, error } = useWorkerStore()
  const [elapsedTime, setElapsedTime] = useState('0h 0m')

  useEffect(() => {
    if (!currentShift || currentShift.status !== 'active') return

    const updateTimer = () => {
      const start = new Date(currentShift.startTime)
      const now = new Date()
      const diffMs = now.getTime() - start.getTime()
      const hours = Math.floor(diffMs / 3600000)
      const minutes = Math.floor((diffMs % 3600000) / 60000)
      setElapsedTime(`${hours}h ${minutes}m`)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 60000)
    return () => clearInterval(interval)
  }, [currentShift])

  const isClockedIn = currentShift?.status === 'active'

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Time Clock</h2>
        <p className="text-gray-600">Track your work hours</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {isClockedIn ? (
        <div className="space-y-6">
          <div className="bg-green-50 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="text-green-600" size={24} />
              <span className="text-lg font-semibold text-green-700">Clocked In</span>
            </div>
            <p className="text-3xl font-bold text-green-600 my-4">{elapsedTime}</p>
            <p className="text-sm text-green-600">
              Since {new Date(currentShift.startTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          <button
            onClick={clockOut}
            disabled={isLoading}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Clock Out'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <Clock className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="text-gray-600 font-medium">Ready to start?</p>
            <p className="text-sm text-gray-500 mt-1">Clock in to begin your shift</p>
          </div>

          <button
            onClick={clockIn}
            disabled={isLoading}
            className="w-full bg-grenrose-600 text-white py-3 rounded-lg font-semibold hover:bg-grenrose-700 transition disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Clock In'}
          </button>
        </div>
      )}
    </div>
  )
}
