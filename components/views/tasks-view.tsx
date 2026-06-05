'use client'

import { useProject } from '@/lib/project-context'
import { CheckCircle, Circle, AlertCircle } from 'lucide-react'

export function TasksView() {
  const { projects, activeProjectId, updateTask } = useProject()

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600'
      case 'medium':
        return 'text-orange-600'
      case 'low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
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
                    className="p-3 bg-background rounded border border-border hover:border-primary transition-colors group"
                  >
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
                        <p
                          className={`text-sm font-medium ${
                            task.status === 'done' ? 'line-through text-muted-foreground' : ''
                          }`}
                        >
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                            {task.priority.toUpperCase()}
                          </span>
                          {task.tags && (
                            <div className="flex gap-1 flex-wrap">
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
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
