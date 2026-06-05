'use client'

import { useProject } from '@/lib/project-context'

export function TimelineView() {
  const { projects, activeProjectId } = useProject()

  const activeProject = projects.find((p) => p.id === activeProjectId)
  if (!activeProject) return null

  const events = [
    ...activeProject.tasks.map((t) => ({
      date: t.dueDate,
      title: t.title,
      type: 'task' as const,
      priority: t.priority,
    })),
    ...activeProject.milestones.map((m) => ({
      date: m.targetDate,
      title: m.title,
      type: 'milestone' as const,
    })),
  ].sort((a, b) => a.date.getTime() - b.date.getTime())

  return (
    <div className="flex flex-col gap-6 p-6">
      <h2 className="text-2xl font-bold">Timeline</h2>
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
        <div className="space-y-6">
          {events.map((event, idx) => (
            <div key={idx} className="relative pl-20">
              <div className="absolute left-0 top-2 w-4 h-4 bg-primary rounded-full border-4 border-background" />
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">
                  {event.date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <p className="font-semibold">{event.title}</p>
                {event.type === 'task' && (
                  <span
                    className={`inline-block text-xs font-semibold mt-2 px-2 py-1 rounded ${
                      event.priority === 'high'
                        ? 'bg-red-100 text-red-700'
                        : event.priority === 'medium'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {event.priority.toUpperCase()} PRIORITY
                  </span>
                )}
                {event.type === 'milestone' && (
                  <span className="inline-block text-xs font-semibold mt-2 px-2 py-1 rounded bg-purple-100 text-purple-700">
                    MILESTONE
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
