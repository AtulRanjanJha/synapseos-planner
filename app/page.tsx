'use client'

import { ProjectProvider, useProject } from '@/lib/project-context'
import { ProjectTabs } from '@/components/project-tabs'
import { Sidebar } from '@/components/sidebar'
import { DayDetails } from '@/components/day-details'
import { SettingsPanel } from '@/components/settings-panel'
import { CalendarView } from '@/components/views/calendar-view'
import { TimelineView } from '@/components/views/timeline-view'
import { WeeklyView } from '@/components/views/weekly-view'
import { TasksView } from '@/components/views/tasks-view'
import { MilestonesView } from '@/components/views/milestones-view'
import { NotesView } from '@/components/views/notes-view'
import { AnalyticsView } from '@/components/views/analytics-view'

function AppContent() {
  const { activeView } = useProject()

  const renderView = () => {
    switch (activeView) {
      case 'calendar':
        return <CalendarView />
      case 'timeline':
        return <TimelineView />
      case 'weekly':
        return <WeeklyView />
      case 'tasks':
        return <TasksView />
      case 'milestones':
        return <MilestonesView />
      case 'notes':
        return <NotesView />
      case 'analytics':
        return <AnalyticsView />
      default:
        return <CalendarView />
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <ProjectTabs />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {renderView()}
        </main>
        <DayDetails />
      </div>
      <SettingsPanel />
    </div>
  )
}

export default function Page() {
  return (
    <ProjectProvider>
      <AppContent />
    </ProjectProvider>
  )
}
