'use client'

import { useState } from 'react'
import { useProject } from '@/lib/project-context'
import { CheckCircle, Circle, AlertCircle, ChevronDown, ChevronUp, Plus, Trash2, CheckCircle2 } from 'lucide-react'
import { AddSubtaskModal } from '@/components/add-subtask-modal'

export function TasksView() {
  const { projects, activeProjectId, updateTask, addSubTask, updateSubTask, deleteSubTask } = useProject()
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set())
  const [subtaskInputs, setSubtaskInputs] = useState<Record<string, string>>({})
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

  const toggleTaskExpand = (taskId: string) => {
    setExpandedTasks((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(taskId)) {
        newSet.delete(taskId)
      } else {
        newSet.add(taskId)
      }
      return newSet
    })
  }

  const handleAddSubtask = (taskId: string) => {
    const text = subtaskInputs[taskId]?.trim()
    if (text) {
      const subtask = {
        id: `subtask-${Date.now()}`,
        title: text,
        description: '',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        priority: 'medium' as const,
        status: 'todo' as const,
        tags: [],
      }
      addSubTask(activeProjectId, taskId, subtask)
      setSubtaskInputs((prev) => ({ ...prev, [taskId]: '' }))
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'in-progress':
        return <AlertCircle className="w-4 h-4 text-orange-600" />
      default:
        return <Circle className="w-4 h-4" />
    }
  }

  const handleAddSubtaskFromModal = (subtaskData: {
    title: string
    description: string
    priority: 'low' | 'medium' | 'high'
    category: string
    dueDate: Date
  }) => {
    if (!selectedTaskId) return

    const subtask = {
      id: `subtask-${Date.now()}`,
      title: subtaskData.title,
      description: subtaskData.description,
      dueDate: subtaskData.dueDate,
      priority: subtaskData.priority,
      status: 'todo' as const,
      category: subtaskData.category,
      tags: [],
    }
    addSubTask(activeProjectId, selectedTaskId, subtask)
    setSelectedTaskId(null)
  }

  const activeProject = projects.find((p) => p.id === activeProjectId)
  if (!activeProject) return null

  const tasksByStatus = {
    todo: activeProject.tasks.filter((t) => t.status === 'todo'),
    'in-progress': activeProject.tasks.filter((t) => t.status === 'in-progress'),
    done: activeProject.tasks.filter((t) => t.status === 'done'),
  }

  const handleToggle = (taskId: string, currentStatus: string) => {
    const nextStatus =
      currentStatus === 'todo' ? 'in-progress' : currentStatus === 'in-progress' ? 'done' : 'todo'
    updateTask(activeProjectId, taskId, { status: nextStatus })
  }

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-200 text-red-700'
      case 'medium':
        return 'bg-amber-200 text-amber-700'
      case 'low':
        return 'bg-green-200 text-green-700'
      default:
        return 'bg-gray-200 text-gray-700'
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-6">Tasks</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(tasksByStatus).map(([status, tasks]) => (
            <div
              key={status}
              className="bg-card border border-border rounded-lg p-4"
            >
              <h3 className="font-semibold text-sm uppercase text-muted-foreground mb-4 capitalize">
                {status.replace('-', ' ')} ({tasks.length})
              </h3>
              <div className="flex flex-col gap-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-background rounded border border-border overflow-hidden"
                  >
                    <div className="p-3 hover:bg-muted transition-colors">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleToggle(task.id, task.status)}
                          className="mt-1 flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {task.status === 'done' ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : task.status === 'in-progress' ? (
                            <AlertCircle className="w-5 h-5 text-orange-600" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={`text-sm font-medium ${
                                task.status === 'done' ? 'line-through text-muted-foreground' : ''
                              }`}
                            >
                              {task.title}
                            </p>
                            {task.subtasks && task.subtasks.length > 0 && (
                              <button
                                onClick={() => toggleTaskExpand(task.id)}
                                className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {expandedTasks.has(task.id) ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </button>
                            )}
                          </div>
                          {task.description && (
                            <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className={`text-xs px-2 py-0.5 rounded font-medium ${getPriorityBadgeClass(task.priority)}`}>
                              {task.priority}
                            </span>
                            {task.tags && (
                              <div className="flex gap-1">
                                {task.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {expandedTasks.has(task.id) && (
                      <div className="border-t border-border bg-muted/30 p-3 space-y-2">
                        <div className="text-xs font-semibold text-muted-foreground uppercase mb-3">Subtasks</div>
                        {task.subtasks && task.subtasks.map((subtask) => (
                          <div key={subtask.id} className="bg-background rounded border border-border p-2 space-y-1">
                            <div className="flex items-start gap-2">
                              <button
                                onClick={() => updateSubTask(activeProjectId, task.id, subtask.id, { status: subtask.status === 'todo' ? 'in-progress' : subtask.status === 'in-progress' ? 'done' : 'todo' })}
                                className="mt-0.5 flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {getStatusIcon(subtask.status)}
                              </button>
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs font-medium ${subtask.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                  {subtask.title}
                                </p>
                                {subtask.description && (
                                  <p className="text-xs text-muted-foreground mt-0.5">{subtask.description}</p>
                                )}
                              </div>
                              <button
                                onClick={() => deleteSubTask(activeProjectId, task.id, subtask.id)}
                                className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2 ml-6 flex-wrap">
                              <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${getPriorityBadgeClass(subtask.priority)}`}>
                                {subtask.priority}
                              </span>
                              {subtask.category && (
                                <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">
                                  {subtask.category}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                        
                        <button
                          onClick={() => {
                            setSelectedTaskId(task.id)
                            setModalOpen(true)
                          }}
                          className="mt-3 w-full py-2 px-3 rounded border border-dashed border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-xs flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Subtask
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddSubtaskModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setSelectedTaskId(null)
        }}
        onAdd={handleAddSubtaskFromModal}
        categories={activeProject.categories}
      />
    </div>
  )
}
