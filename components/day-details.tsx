'use client'

import React, { useState } from 'react'
import { useProject } from '@/lib/project-context'
import { X, Plus, Trash2, CheckCircle, AlertCircle, Circle } from 'lucide-react'

export function DayDetails() {
  const { projects, activeProjectId, selectedDate, addTask, addNote, setSelectedDate, addSubTask, updateSubTask, deleteSubTask } = useProject()
  const [showAddTask, setShowAddTask] = useState(false)
  const [showAddNote, setShowAddNote] = useState(false)
  const [taskTitle, setTaskTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null)
  const [subtaskInputs, setSubtaskInputs] = useState<Record<string, string>>({})

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
                className="border border-border rounded overflow-hidden"
              >
                <div className="p-2 bg-background hover:bg-muted cursor-pointer transition-colors" onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-xs font-medium text-foreground">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          task.priority === 'high'
                            ? 'bg-red-200 text-red-700'
                            : task.priority === 'medium'
                              ? 'bg-amber-200 text-amber-700'
                              : 'bg-green-200 text-green-700'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {expandedTaskId === task.id && task.subtasks && task.subtasks.length > 0 && (
                  <div className="border-t border-border bg-muted/30 p-2 space-y-2">
                    {task.subtasks.map((subtask) => (
                      <div key={subtask.id} className="bg-background rounded border border-border p-1.5 text-xs">
                        <div className="flex items-start gap-2">
                          <button
                            onClick={() => updateSubTask(activeProjectId, task.id, subtask.id, { status: subtask.status === 'todo' ? 'in-progress' : subtask.status === 'in-progress' ? 'done' : 'todo' })}
                            className="mt-0.5 flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {subtask.status === 'done' ? (
                              <CheckCircle className="w-3 h-3 text-green-600" />
                            ) : subtask.status === 'in-progress' ? (
                              <AlertCircle className="w-3 h-3 text-orange-600" />
                            ) : (
                              <Circle className="w-3 h-3" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium ${subtask.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                              {subtask.title}
                            </p>
                            <div className="flex items-center gap-1 mt-1 flex-wrap">
                              <span className={`px-1 py-0.5 rounded text-xs font-medium ${
                                subtask.priority === 'high'
                                  ? 'bg-red-200 text-red-700'
                                  : subtask.priority === 'medium'
                                    ? 'bg-amber-200 text-amber-700'
                                    : 'bg-green-200 text-green-700'
                              }`}>
                                {subtask.priority}
                              </span>
                              {subtask.category && (
                                <span className="px-1 py-0.5 rounded text-xs font-medium bg-blue-200 text-blue-700">
                                  {subtask.category}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => deleteSubTask(activeProjectId, task.id, subtask.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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


