export interface SubTask {
  id: string
  title: string
  completed: boolean
}

export interface Task {
  id: string
  title: string
  description?: string
  dueDate: Date
  priority: 'low' | 'medium' | 'high'
  status: 'todo' | 'in-progress' | 'done'
  tags?: string[]
  subtasks?: SubTask[]
}

export interface Milestone {
  id: string
  title: string
  description?: string
  targetDate: Date
  completed: boolean
  progress: number
}

export interface Note {
  id: string
  title: string
  content: string
  date: Date
  tags?: string[]
}

export interface DayEvent {
  id: string
  date: Date
  title: string
  description?: string
  type: 'task' | 'event' | 'note' | 'milestone'
  priority?: 'low' | 'medium' | 'high'
}

export interface Project {
  id: string
  name: string
  description?: string
  color: string
  createdAt: Date
  tasks: Task[]
  milestones: Milestone[]
  notes: Note[]
  events: DayEvent[]
}

export type ViewType = 'calendar' | 'timeline' | 'weekly' | 'tasks' | 'milestones' | 'notes' | 'analytics'
