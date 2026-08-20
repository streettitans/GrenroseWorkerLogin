import { create } from 'zustand'
import { apiClient } from '@/lib/api'

export interface Worker {
  id: string
  workerId: string
  name: string
  email: string
  phone: string
  department: string
}

export interface Shift {
  id: string
  workerId: string
  date: string
  startTime: string
  endTime: string
  status: 'pending' | 'active' | 'completed' | 'cancelled'
  hoursWorked?: number
}

interface WorkerState {
  worker: Worker | null
  shifts: Shift[]
  currentShift: Shift | null
  token: string | null
  isLoading: boolean
  error: string | null

  // Actions
  login: (workerId: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
  getShifts: () => Promise<void>
  clockIn: () => Promise<void>
  clockOut: () => Promise<void>
  getCurrentShift: () => Promise<void>
}

export const useWorkerStore = create<WorkerState>((set, get) => ({
  worker: null,
  shifts: [],
  currentShift: null,
  token: null,
  isLoading: false,
  error: null,

  login: async (workerId: string, password: string) => {
    set({ isLoading: true, error: null })
    try {
      const data = await apiClient.post<{
        token: string
        worker: Worker
      }>('/worker/login', { workerId, password })

      localStorage.setItem('worker_token', data.token)
      set({ worker: data.worker, token: data.token, isLoading: false })
    } catch (error: any) {
      set({
        error: error.message || 'Login failed',
        isLoading: false,
      })
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem('worker_token')
    set({ worker: null, token: null, currentShift: null })
  },

  checkAuth: async () => {
    const token = localStorage.getItem('worker_token')
    if (!token) {
      set({ worker: null, token: null })
      return
    }

    try {
      const worker = await apiClient.get<Worker>('/worker/me')
      set({ worker, token })
    } catch {
      localStorage.removeItem('worker_token')
      set({ worker: null, token: null })
    }
  },

  getShifts: async () => {
    set({ isLoading: true })
    try {
      const shifts = await apiClient.get<Shift[]>('/worker/shifts')
      set({ shifts, isLoading: false })
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch shifts',
        isLoading: false,
      })
    }
  },

  clockIn: async () => {
    try {
      const shift = await apiClient.post<Shift>('/worker/clock-in')
      set({ currentShift: shift })
    } catch (error: any) {
      set({ error: error.message || 'Clock in failed' })
      throw error
    }
  },

  clockOut: async () => {
    try {
      const shift = await apiClient.post<Shift>('/worker/clock-out')
      set({ currentShift: null })
      await get().getShifts()
    } catch (error: any) {
      set({ error: error.message || 'Clock out failed' })
      throw error
    }
  },

  getCurrentShift: async () => {
    try {
      const shift = await apiClient.get<Shift | null>('/worker/current-shift')
      set({ currentShift: shift })
    } catch {
      set({ currentShift: null })
    }
  },
}))
