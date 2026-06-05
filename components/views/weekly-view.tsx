'use client'

import { useProject } from '@/lib/project-context'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

export function WeeklyView() {
  const { projects, activeProjectId, selectedDate, setSelectedDate } = useProject()
  const [weekStart, setWeekStart] = useState(getMonday(new Date()))

  function getMonday(date: Date) {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(d.setDate(diff))
  }

  const activeProject = projects.find((p) => p.id === activeProjectId)
  if (!activeProject) return null

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart)
    date.setDate(date.getDate() + i)
    return date
  })

  const getTasksForDate = (date: Date) => {
    return activeProject.tasks.filter(
      (t) =>
        t.dueDate.getDate() === date.getDate() &&
        t.dueDate.getMonth() === date.getMonth() &&
        t.dueDate.getFullYear() === date.getFullYear()
    )
  }

  const handlePrevWeek = () => {
    const prev = new Date(weekStart)
    prev.setDate(prev.getDate() - 7)
    setWeekStart(prev)
  }

  const handleNextWeek = () => {
    const next = new Date(weekStart)
    next.setDate(next.getDate() + 7)
    setWeekStart(next)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Week of {weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </h2>
        <div className="flex gap-2">
          <button onClick={handlePrevWeek} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={handleNextWeek} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => {
          const tasks = getTasksForDate(day)
          const isToday =
            day.getDate() === new Date().getDate() &&
            day.getMonth() === new Date().getMonth() &&
            day.getFullYear() === new Date().getFullYear()

          return (
            <button
              key={day.toISOString()}
              onClick={() => setSelectedDate(day)}
              className={`flex flex-col gap-2 rounded-lg border border-border p-3 min-h-40 transition-colors ${
                isToday ? 'bg-primary/5 border-primary' : 'bg-card hover:bg-muted'
              }`}
            >
              <div className={`text-sm font-semibold ${isToday ? 'text-primary' : ''}`}>
                {day.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className="text-lg font-bold text-foreground">{day.getDate()}</div>
              <div className="flex-1 flex flex-col gap-1 text-left">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`text-xs px-2 py-1 rounded truncate font-medium ${
                      task.status === 'done'
                        ? 'bg-green-100 text-green-700'
                        : task.priority === 'high'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {task.title}
                  </div>
                ))}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
