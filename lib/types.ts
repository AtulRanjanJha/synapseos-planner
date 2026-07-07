export interface WeeklyAgenda {
  id: string
  weekStart: Date
  title?: string
  content: string
}

export interface Project {
  id: string
  name: string
  description?: string
  color: string
  createdAt: Date
  categories: string[]

  tasks: Task[]
  milestones: Milestone[]
  notes: Note[]
  events: DayEvent[]

  // NEW
  weeklyAgendas: WeeklyAgenda[]
}
