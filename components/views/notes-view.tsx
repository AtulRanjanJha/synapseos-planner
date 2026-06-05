'use client'

import { useState } from 'react'
import { useProject } from '@/lib/project-context'
import { Trash2, Plus } from 'lucide-react'
import { AddNoteModal } from '@/components/add-note-modal'

export function NotesView() {
  const { projects, activeProjectId, deleteNote, addNote } = useProject()
  const [modalOpen, setModalOpen] = useState(false)

  const activeProject = projects.find((p) => p.id === activeProjectId)
  if (!activeProject) return null

  const sortedNotes = [...activeProject.notes].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  )

  const handleAddNote = (noteData: {
    title: string
    content: string
    tags: string[]
  }) => {
    addNote(activeProjectId, {
      id: `note-${Date.now()}`,
      title: noteData.title,
      content: noteData.content,
      tags: noteData.tags,
      date: new Date(),
    })
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Notes</h2>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded bg-accent text-white font-medium hover:opacity-90 transition-opacity text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Note
          </button>
        </div>
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

      <AddNoteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddNote}
      />
    </div>
  )
}
