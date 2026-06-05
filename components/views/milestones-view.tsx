'use client'

import { useState } from 'react'
import { useProject } from '@/lib/project-context'
import { Flag, Check, Plus } from 'lucide-react'
import { AddMilestoneModal } from '@/components/add-milestone-modal'

export function MilestonesView() {
  const { projects, activeProjectId, updateMilestone, addMilestone } = useProject()
  const [modalOpen, setModalOpen] = useState(false)

  const activeProject = projects.find((p) => p.id === activeProjectId)
  if (!activeProject) return null

  const sortedMilestones = [...activeProject.milestones].sort(
    (a, b) => a.targetDate.getTime() - b.targetDate.getTime()
  )

  const handleToggleComplete = (milestoneId: string) => {
    const milestone = activeProject.milestones.find((m) => m.id === milestoneId)
    if (milestone) {
      updateMilestone(activeProjectId, milestoneId, { completed: !milestone.completed })
    }
  }

  const handleAddMilestone = (milestoneData: {
    title: string
    description: string
    targetDate: Date
    progress: number
  }) => {
    addMilestone(activeProjectId, {
      id: `milestone-${Date.now()}`,
      title: milestoneData.title,
      description: milestoneData.description,
      targetDate: milestoneData.targetDate,
      progress: milestoneData.progress,
      completed: false,
    })
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Milestones</h2>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded bg-accent text-white font-medium hover:opacity-90 transition-opacity text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Milestone
          </button>
        </div>
        <div className="space-y-4">
          {sortedMilestones.map((milestone) => (
            <div
              key={milestone.id}
              className="bg-card border border-border rounded-lg p-4 hover:border-primary transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <button
                      onClick={() => handleToggleComplete(milestone.id)}
                      className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {milestone.completed ? (
                        <Check className="w-6 h-6 text-green-600" />
                      ) : (
                        <Flag className="w-6 h-6 text-blue-600" />
                      )}
                    </button>
                    <h3
                      className={`text-lg font-semibold ${
                        milestone.completed ? 'line-through text-muted-foreground' : ''
                      }`}
                    >
                      {milestone.title}
                    </h3>
                  </div>
                  {milestone.description && (
                    <p className="text-sm text-muted-foreground mb-3">{milestone.description}</p>
                  )}
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">
                      {milestone.targetDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <div className="flex-1 max-w-xs">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium">{milestone.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary rounded-full h-2 transition-all"
                          style={{ width: `${milestone.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddMilestoneModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddMilestone}
      />
    </div>
  )
}
