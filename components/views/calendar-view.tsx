'use client'

import { useProject } from '@/lib/project-context'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

export function CalendarView() {
  const { projects, activeProjectId, selectedDate, setSelectedDate } = useProject()
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const activeProject = projects.find((p) => p.id === activeProjectId)
  if (!activeProject) return null

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
  const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)

  const handlePrevMonth = () => setCurrentMonth(prevMonth)
  const handleNextMonth = () => setCurrentMonth(nextMonth)

  const getTasksForDate = (date: Date | null) => {
    if (!date) return []
    return activeProject.tasks.filter(
      (t) =>
        t.dueDate.getDate() === date.getDate() &&
        t.dueDate.getMonth() === date.getMonth() &&
        t.dueDate.getFullYear() === date.getFullYear()
    )
  }

  const getMilestonesForDate = (date: Date | null) => {
    if (!date) return []
    return activeProject.milestones.filter(
      (m) =>
        m.targetDate.getDate() === date.getDate() &&
        m.targetDate.getMonth() === date.getMonth() &&
        m.targetDate.getFullYear() === date.getFullYear()
    )
  }

  const isToday = (date: Date | null) => {
    if (!date) return false
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (date: Date | null) => {
    if (!date) return false
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i))
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="grid grid-cols-7 gap-0 border-b border-border">
          {weekDays.map((day) => (
            <div key={day} className="p-3 text-center text-sm font-semibold text-muted-foreground border-r border-border last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0">
          {days.map((day, idx) => {
            const tasks = day ? getTasksForDate(day) : []
            const milestones = day ? getMilestonesForDate(day) : []
            const hasEvents = tasks.length > 0 || milestones.length > 0

            return (
              <button
                key={idx}
                onClick={() => day && setSelectedDate(day)}
                className={`min-h-24 p-2 border-r border-b border-border last:border-r-0 text-left transition-colors ${
                  day ? 'hover:bg-muted' : 'bg-muted'
                } ${isSelected(day!) ? 'ring-2 ring-accent bg-accent/5' : ''} ${
                  isToday(day!) ? 'bg-primary/5' : ''
                }`}
              >
                {day && (
                  <div className="flex flex-col gap-1">
                    <span className={`text-sm font-semibold ${isToday(day) ? 'text-primary' : ''}`}>
                      {day.getDate()}
                    </span>
                    {hasEvents && (
                      <div className="flex flex-col gap-0.5">
                        {tasks.map((task) => (
                          <div
                            key={task.id}
                            className={`text-xs px-1 py-0.5 rounded truncate ${
                              task.status === 'done'
                                ? 'bg-green-200 text-green-700'
                                : task.priority === 'high'
                                  ? 'bg-red-200 text-red-700'
                                  : task.priority === 'medium'
                                    ? 'bg-amber-200 text-amber-700'
                                    : 'bg-green-200 text-green-700'
                            }`}
                          >
                            {task.title}
                          </div>
                        ))}
                        {milestones.map((m) => (
                          <div
                            key={m.id}
                            className="text-xs px-1 py-0.5 rounded truncate bg-purple-100 text-purple-700 font-semibold"
                          >
                            {m.title}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
