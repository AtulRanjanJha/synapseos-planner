'use client'

import { useProject } from '@/lib/project-context'
import { X, Plus } from 'lucide-react'
import { useState } from 'react'

export function ProjectTabs() {
  const { projects, activeProjectId, setActiveProject, addProject, deleteProject } = useProject()
  const [isCreating, setIsCreating] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (newProjectName.trim()) {
      const newProject = {
        id: `project-${Date.now()}`,
        name: newProjectName,
        description: '',
        color: '#3B82F6',
        createdAt: new Date(),
        tasks: [],
        milestones: [],
        notes: [],
        events: [],
      }
      addProject(newProject)
      setActiveProject(newProject.id)
      setNewProjectName('')
      setIsCreating(false)
    }
  }

  return (
    <div className="flex items-center gap-1 border-b border-border bg-background px-3 py-3 overflow-x-auto">
      {projects.map((project) => (
        <div
          key={project.id}
          className={`group relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
            activeProjectId === project.id
              ? 'bg-card text-foreground border border-border'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
          onClick={() => setActiveProject(project.id)}
        >
          <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: project.color }} />
          <span className="max-w-xs truncate">{project.name}</span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              deleteProject(project.id)
            }}
            className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}

      {!isCreating ? (
        <button
          onClick={() => setIsCreating(true)}
          className="ml-2 flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      ) : (
        <form onSubmit={handleCreateProject} className="flex items-center gap-2 ml-2">
          <input
            type="text"
            placeholder="Project name..."
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            autoFocus
            className="px-2 py-1 text-sm rounded border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="submit"
            className="px-2 py-1 text-sm bg-primary text-primary-foreground rounded hover:opacity-90"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => {
              setIsCreating(false)
              setNewProjectName('')
            }}
            className="px-2 py-1 text-sm text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  )
}
