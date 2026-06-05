'use client'

import { useProject } from '@/lib/project-context'
import { Trash2 } from 'lucide-react'

export function NotesView() {
  const { projects, activeProjectId, deleteNote } = useProject()

  const activeProject = projects.find((p) => p.id === activeProjectId)
  if (!activeProject) return null

  const sortedNotes = [...activeProject.notes].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  )

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-6">Notes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedNotes.map((note) => (
            <div
              key={note.id}
              className="bg-card border border-border rounded-lg p-4 hover:border-primary transition-colors group"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-foreground">{note.title}</h3>
                <button
                  onClick={() => deleteNote(activeProjectId, note.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-4">{note.content}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {note.date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                {note.tags && (
                  <div className="flex gap-1 flex-wrap justify-end">
                    {note.tags.map((tag) => (
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
          ))}
        </div>
      </div>
    </div>
  )
}
