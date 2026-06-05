'use client'

import { useState } from 'react'
import { X, Plus } from 'lucide-react'

interface AddSubtaskModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (subtask: {
    title: string
    description: string
    priority: 'low' | 'medium' | 'high'
    category: string
    dueDate: Date
  }) => void
  categories: string[]
}

export function AddSubtaskModal({ isOpen, onClose, onAdd, categories }: AddSubtaskModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [category, setCategory] = useState(categories[0] || 'frontend')
  const [dueDate, setDueDate] = useState(
    new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]
  )
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategory, setNewCategory] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const selectedCategory = showNewCategory && newCategory.trim() ? newCategory.trim() : category

    onAdd({
      title: title.trim(),
      description: description.trim(),
      priority,
      category: selectedCategory,
      dueDate: new Date(dueDate),
    })

    // Reset form
    setTitle('')
    setDescription('')
    setPriority('medium')
    setCategory(categories[0] || 'frontend')
    setDueDate(new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0])
    setShowNewCategory(false)
    setNewCategory('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Add Subtask</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Subtask Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter subtask title"
              className="w-full px-3 py-2 rounded border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter subtask description (optional)"
              className="w-full px-3 py-2 rounded border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm resize-none h-20"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Priority
            </label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                    priority === p
                      ? p === 'high'
                        ? 'bg-red-200 text-red-700'
                        : p === 'medium'
                          ? 'bg-amber-200 text-amber-700'
                          : 'bg-green-200 text-green-700'
                      : 'bg-muted text-muted-foreground hover:bg-border'
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Category
            </label>
            {!showNewCategory ? (
              <div className="space-y-2">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewCategory(true)}
                  className="w-full py-2 px-3 rounded border border-dashed border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create New Category
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter new category name"
                  className="w-full px-3 py-2 rounded border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowNewCategory(false)
                    setNewCategory('')
                  }}
                  className="w-full py-2 px-3 rounded border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-sm"
                >
                  Use Existing Category
                </button>
              </div>
            )}
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 rounded border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 py-2 px-4 rounded bg-accent text-white font-medium hover:opacity-90 transition-opacity text-sm"
            >
              Add Subtask
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 rounded border border-border text-foreground hover:bg-muted transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
