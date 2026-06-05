'use client'

import { useProject } from '@/lib/project-context'
import { Calendar, List, BarChart3, Milestone, StickyNote, Clock } from 'lucide-react'
import { ViewType } from '@/lib/types'

const VIEWS: { type: ViewType; label: string; icon: React.ReactNode }[] = [
  { type: 'calendar', label: 'Calendar', icon: <Calendar className="w-5 h-5" /> },
  { type: 'timeline', label: 'Timeline', icon: <Clock className="w-5 h-5" /> },
  { type: 'weekly', label: 'Weekly', icon: <BarChart3 className="w-5 h-5" /> },
  { type: 'tasks', label: 'Tasks', icon: <List className="w-5 h-5" /> },
  { type: 'milestones', label: 'Milestones', icon: <Milestone className="w-5 h-5" /> },
  { type: 'notes', label: 'Notes', icon: <StickyNote className="w-5 h-5" /> },
  { type: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
]

export function Sidebar() {
  const { activeView, setActiveView } = useProject()

  return (
    <aside className="w-64 border-r border-border bg-card">
      <nav className="flex flex-col gap-1 p-4">
        <h3 className="px-2 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Views
        </h3>
        {VIEWS.map((view) => (
          <button
            key={view.type}
            onClick={() => setActiveView(view.type)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              activeView === view.type
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-muted'
            }`}
          >
            {view.icon}
            <span>{view.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}
