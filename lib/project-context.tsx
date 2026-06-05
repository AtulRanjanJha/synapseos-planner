'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { Project, Task, Milestone, Note, DayEvent, ViewType, SubTask } from './types'

interface ProjectContextType {
  projects: Project[]
  activeProjectId: string
  activeView: ViewType
  selectedDate: Date
  addProject: (project: Project) => void
  deleteProject: (projectId: string) => void
  setActiveProject: (projectId: string) => void
  setActiveView: (view: ViewType) => void
  setSelectedDate: (date: Date) => void
  addTask: (projectId: string, task: Task) => void
  updateTask: (projectId: string, taskId: string, task: Partial<Task>) => void
  deleteTask: (projectId: string, taskId: string) => void
  addMilestone: (projectId: string, milestone: Milestone) => void
  updateMilestone: (projectId: string, milestoneId: string, milestone: Partial<Milestone>) => void
  deleteMilestone: (projectId: string, milestoneId: string) => void
  addNote: (projectId: string, note: Note) => void
  updateNote: (projectId: string, noteId: string, note: Partial<Note>) => void
  deleteNote: (projectId: string, noteId: string) => void
  addEvent: (projectId: string, event: DayEvent) => void
  deleteEvent: (projectId: string, eventId: string) => void
  addSubTask: (projectId: string, taskId: string, subtask: SubTask) => void
  updateSubTask: (projectId: string, taskId: string, subtaskId: string, subtask: Partial<SubTask>) => void
  deleteSubTask: (projectId: string, taskId: string, subtaskId: string) => void
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

// Default SynapseOS 26-week roadmap
const DEFAULT_PROJECT: Project = {
  id: 'synapse-os-26',
  name: 'SynapseOS 26 Roadmap',
  description: 'Next generation operating system',
  color: '#3B82F6',
  createdAt: new Date(),
  tasks: [
    {
      id: 'task-1',
      title: 'Core System Architecture',
      description: 'Design and implement kernel foundation',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 14)),
      priority: 'high',
      status: 'in-progress',
      tags: ['core', 'architecture'],
      subtasks: [
        {
          id: 'sub-1-1',
          title: 'Design kernel modules',
          description: 'Design the core kernel module system',
          dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
          priority: 'high',
          status: 'done',
          tags: ['design'],
        },
        {
          id: 'sub-1-2',
          title: 'Implement boot loader',
          description: 'Create the boot loader implementation',
          dueDate: new Date(new Date().setDate(new Date().getDate() + 10)),
          priority: 'high',
          status: 'done',
          tags: ['core'],
        },
        {
          id: 'sub-1-3',
          title: 'Memory management setup',
          description: 'Set up memory management subsystem',
          dueDate: new Date(new Date().setDate(new Date().getDate() + 12)),
          priority: 'high',
          status: 'in-progress',
          tags: ['memory'],
        },
      ],
    },
    {
      id: 'task-2',
      title: 'Device Driver Framework',
      description: 'Create universal driver interface',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 28)),
      priority: 'high',
      status: 'todo',
      tags: ['drivers', 'hardware'],
    },
    {
      id: 'task-3',
      title: 'File System Implementation',
      description: 'Build high-performance filesystem',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 42)),
      priority: 'medium',
      status: 'todo',
      tags: ['storage'],
    },
    {
      id: 'task-4',
      title: 'Memory Management',
      description: 'Implement advanced memory allocation',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 35)),
      priority: 'high',
      status: 'in-progress',
      tags: ['core'],
    },
    {
      id: 'task-5',
      title: 'UI Framework Development',
      description: 'Create modern desktop environment',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 56)),
      priority: 'medium',
      status: 'todo',
      tags: ['ui', 'frontend'],
    },
  ],
  milestones: [
    {
      id: 'milestone-1',
      title: 'Alpha Release v0.1',
      description: 'Initial kernel with basic drivers',
      targetDate: new Date(new Date().setDate(new Date().getDate() + 42)),
      completed: false,
      progress: 30,
    },
    {
      id: 'milestone-2',
      title: 'Beta Release v0.5',
      description: 'Complete filesystem and UI framework',
      targetDate: new Date(new Date().setDate(new Date().getDate() + 84)),
      completed: false,
      progress: 0,
    },
    {
      id: 'milestone-3',
      title: 'Production Release v1.0',
      description: 'Full feature-complete OS',
      targetDate: new Date(new Date().setDate(new Date().getDate() + 168)),
      completed: false,
      progress: 0,
    },
  ],
  notes: [
    {
      id: 'note-1',
      title: 'Architecture Notes',
      content: 'Microkernel-based design with pluggable modules. Prioritize security and modularity.',
      date: new Date(),
      tags: ['architecture'],
    },
  ],
  events: [],
}

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([DEFAULT_PROJECT])
  const [activeProjectId, setActiveProjectId] = useState(DEFAULT_PROJECT.id)
  const [activeView, setActiveView] = useState<ViewType>('calendar')
  const [selectedDate, setSelectedDate] = useState(new Date())

  const setActiveProject = useCallback((projectId: string) => {
    setActiveProjectId(projectId)
  }, [])

  const addProject = useCallback((project: Project) => {
    setProjects((prev) => [...prev, project])
  }, [])

  const deleteProject = useCallback((projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId))
    if (activeProjectId === projectId && projects.length > 1) {
      const remainingProjects = projects.filter((p) => p.id !== projectId)
      setActiveProjectId(remainingProjects[0].id)
    }
  }, [activeProjectId, projects])

  const addTask = useCallback((projectId: string, task: Task) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, tasks: [...p.tasks, task] } : p))
    )
  }, [])

  const updateTask = useCallback((projectId: string, taskId: string, taskUpdate: Partial<Task>) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, ...taskUpdate } : t)),
            }
          : p
      )
    )
  }, [])

  const deleteTask = useCallback((projectId: string, taskId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, tasks: p.tasks.filter((t) => t.id !== taskId) }
          : p
      )
    )
  }, [])

  const addMilestone = useCallback((projectId: string, milestone: Milestone) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, milestones: [...p.milestones, milestone] } : p))
    )
  }, [])

  const updateMilestone = useCallback((projectId: string, milestoneId: string, milestoneUpdate: Partial<Milestone>) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              milestones: p.milestones.map((m) => (m.id === milestoneId ? { ...m, ...milestoneUpdate } : m)),
            }
          : p
      )
    )
  }, [])

  const deleteMilestone = useCallback((projectId: string, milestoneId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, milestones: p.milestones.filter((m) => m.id !== milestoneId) }
          : p
      )
    )
  }, [])

  const addNote = useCallback((projectId: string, note: Note) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, notes: [...p.notes, note] } : p))
    )
  }, [])

  const updateNote = useCallback((projectId: string, noteId: string, noteUpdate: Partial<Note>) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              notes: p.notes.map((n) => (n.id === noteId ? { ...n, ...noteUpdate } : n)),
            }
          : p
      )
    )
  }, [])

  const deleteNote = useCallback((projectId: string, noteId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, notes: p.notes.filter((n) => n.id !== noteId) }
          : p
      )
    )
  }, [])

  const addEvent = useCallback((projectId: string, event: DayEvent) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, events: [...p.events, event] } : p))
    )
  }, [])

  const deleteEvent = useCallback((projectId: string, eventId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, events: p.events.filter((e) => e.id !== eventId) }
          : p
      )
    )
  }, [])

  const addSubTask = useCallback((projectId: string, taskId: string, subtask: SubTask) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              tasks: p.tasks.map((t) =>
                t.id === taskId
                  ? { ...t, subtasks: [...(t.subtasks || []), subtask] }
                  : t
              ),
            }
          : p
      )
    )
  }, [])

  const updateSubTask = useCallback((projectId: string, taskId: string, subtaskId: string, subtaskUpdate: Partial<SubTask>) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              tasks: p.tasks.map((t) =>
                t.id === taskId
                  ? {
                      ...t,
                      subtasks: (t.subtasks || []).map((s) =>
                        s.id === subtaskId ? { ...s, ...subtaskUpdate } : s
                      ),
                    }
                  : t
              ),
            }
          : p
      )
    )
  }, [])

  const deleteSubTask = useCallback((projectId: string, taskId: string, subtaskId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              tasks: p.tasks.map((t) =>
                t.id === taskId
                  ? {
                      ...t,
                      subtasks: (t.subtasks || []).filter((s) => s.id !== subtaskId),
                    }
                  : t
              ),
            }
          : p
      )
    )
  }, [])

  const value: ProjectContextType = {
    projects,
    activeProjectId,
    activeView,
    selectedDate,
    addProject,
    deleteProject,
    setActiveProject,
    setActiveView,
    setSelectedDate,
    addTask,
    updateTask,
    deleteTask,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    addNote,
    updateNote,
    deleteNote,
    addEvent,
    deleteEvent,
    addSubTask,
    updateSubTask,
    deleteSubTask,
  }

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}

export function useProject() {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider')
  }
  return context
}
