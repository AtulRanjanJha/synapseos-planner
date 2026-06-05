'use client'

import { useProject } from '@/lib/project-context'
import { X } from 'lucide-react'

export function DayDetails() {
  const { projects, activeProjectId, selectedDate, addTask, addNote, setSelectedDate } = useProject()
  const [showAddTask, setShowAddTask] = React.useState(false)
  const [showAddNote, setShowAddNote] = React.useState(false)
  const [taskTitle, setTaskTitle] = React.useState('')
  const [noteContent, setNoteContent] = React.useState('')

  const activeProject = projects.find((p) => p.id === activeProjectId)
  if (!activeProject) return null

  const tasksForDate = activeProject.tasks.filter(
    (t) =>
      t.dueDate.getDate() === selectedDate.getDate() &&
      t.dueDate.getMonth() === selectedDate.getMonth() &&
      t.dueDate.getFullYear() === selectedDate.getFullYear()
  )

  const notesForDate = activeProject.notes.filter(
    (n) =>
      n.date.getDate() === selectedDate.getDate() &&
      n.date.getMonth() === selectedDate.getMonth() &&
      n.date.getFullYear() === selectedDate.getFullYear()
  )

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (taskTitle.trim()) {
      const newTask = {
        id: `task-${Date.now()}`,
        title: taskTitle,
        dueDate: selectedDate,
        priority: 'medium' as const,
        status: 'todo' as const,
      }
      addTask(activeProjectId, newTask)
      setTaskTitle('')
      setShowAddTask(false)
    }
  }

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (noteContent.trim()) {
      const newNote = {
        id: `note-${Date.now()}`,
        title: 'Note',
        content: noteContent,
        date: selectedDate,
      }
      addNote(activeProjectId, newNote)
      setNoteContent('')
      setShowAddNote(false)
    }
  }

  return (
    <div className="w-80 border-l border-border bg-card h-screen overflow-y-auto">
      <div className="p-4 border-b border-border sticky top-0 bg-card flex items-center justify-between">
        <h3 className="font-semibold">
          {selectedDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </h3>
        <button
          onClick={() => setSelectedDate(new Date())}
          className="p-1 hover:bg-muted rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Tasks</h4>
          <div className="space-y-2 mb-3">
            {tasksForDate.map((task) => (
              <div
                key={task.id}
                className={`text-xs p-2 rounded border border-border ${
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
          {!showAddTask ? (
            <button
              onClick={() => setShowAddTask(true)}
              className="w-full text-left text-sm px-2 py-1 text-primary hover:bg-muted rounded transition-colors"
            >
              + Add task
            </button>
          ) : (
            <form onSubmit={handleAddTask} className="space-y-2">
              <input
                type="text"
                placeholder="Task name..."
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                autoFocus
                className="w-full text-sm px-2 py-1 rounded border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 text-sm px-2 py-1 bg-primary text-primary-foreground rounded hover:opacity-90"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddTask(false)
                    setTaskTitle('')
                  }}
                  className="flex-1 text-sm px-2 py-1 border border-border rounded hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="border-t border-border pt-4">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Notes</h4>
          <div className="space-y-2 mb-3">
            {notesForDate.map((note) => (
              <div key={note.id} className="text-xs p-2 rounded bg-background border border-border">
                <p className="font-semibold mb-1">{note.title}</p>
                <p className="text-muted-foreground">{note.content}</p>
              </div>
            ))}
          </div>
          {!showAddNote ? (
            <button
              onClick={() => setShowAddNote(true)}
              className="w-full text-left text-sm px-2 py-1 text-primary hover:bg-muted rounded transition-colors"
            >
              + Add note
            </button>
          ) : (
            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                placeholder="Note content..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                autoFocus
                className="w-full text-sm px-2 py-1 rounded border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 text-sm px-2 py-1 bg-primary text-primary-foreground rounded hover:opacity-90"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddNote(false)
                    setNoteContent('')
                  }}
                  className="flex-1 text-sm px-2 py-1 border border-border rounded hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

import React from 'react'
