'use client'

import { useProject } from '@/lib/project-context'

export function AnalyticsView() {
  const { projects, activeProjectId } = useProject()

  const activeProject = projects.find((p) => p.id === activeProjectId)
  if (!activeProject) return null

  const stats = {
    totalTasks: activeProject.tasks.length,
    completedTasks: activeProject.tasks.filter((t) => t.status === 'done').length,
    inProgressTasks: activeProject.tasks.filter((t) => t.status === 'in-progress').length,
    todoTasks: activeProject.tasks.filter((t) => t.status === 'todo').length,
    highPriorityTasks: activeProject.tasks.filter((t) => t.priority === 'high').length,
    totalMilestones: activeProject.milestones.length,
    completedMilestones: activeProject.milestones.filter((m) => m.completed).length,
    totalNotes: activeProject.notes.length,
  }

  const completionRate = stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0

  const StatCard = ({
    title,
    value,
    subtext,
    color,
  }: {
    title: string
    value: string | number
    subtext?: string
    color: string
  }) => (
    <div className="bg-card border border-border rounded-lg p-6">
      <p className="text-sm text-muted-foreground mb-2">{title}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
    </div>
  )

  return (
    <div className="flex flex-col gap-6 p-6">
      <h2 className="text-2xl font-bold">Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Tasks" value={stats.totalTasks} color="text-foreground" />
        <StatCard
          title="Completion Rate"
          value={`${completionRate}%`}
          color="text-green-600"
          subtext={`${stats.completedTasks} of ${stats.totalTasks} completed`}
        />
        <StatCard
          title="In Progress"
          value={stats.inProgressTasks}
          color="text-orange-600"
          subtext="Active tasks"
        />
        <StatCard
          title="High Priority"
          value={stats.highPriorityTasks}
          color="text-red-600"
          subtext="Urgent tasks"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Task Status Breakdown</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>To Do</span>
                <span className="font-semibold">{stats.todoTasks}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-blue-500 rounded-full h-2"
                  style={{ width: `${(stats.todoTasks / stats.totalTasks) * 100 || 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>In Progress</span>
                <span className="font-semibold">{stats.inProgressTasks}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-orange-500 rounded-full h-2"
                  style={{ width: `${(stats.inProgressTasks / stats.totalTasks) * 100 || 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Completed</span>
                <span className="font-semibold">{stats.completedTasks}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-green-500 rounded-full h-2"
                  style={{ width: `${(stats.completedTasks / stats.totalTasks) * 100 || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Milestones</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Completed</span>
                <span className="font-semibold">{stats.completedMilestones}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-green-500 rounded-full h-2"
                  style={{ width: `${(stats.completedMilestones / stats.totalMilestones) * 100 || 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Pending</span>
                <span className="font-semibold">{stats.totalMilestones - stats.completedMilestones}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-blue-500 rounded-full h-2"
                  style={{
                    width: `${((stats.totalMilestones - stats.completedMilestones) / stats.totalMilestones) * 100 || 0}%`,
                  }}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">Total notes: {stats.totalNotes}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
