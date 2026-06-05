'use client'

import { useState } from 'react'
import { X, Settings } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

const FONT_FAMILIES = [
  { value: 'sans', label: 'Sans Serif (Default)' },
  { value: 'serif', label: 'Serif' },
  { value: 'mono', label: 'Monospace' },
  { value: 'cursive', label: 'Cursive' },
  { value: 'system', label: 'System Font' },
]

const FONT_SIZES = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium (Default)' },
  { value: 'large', label: 'Large' },
]

const BACKGROUND_PRESETS = [
  { name: 'Light Gray', color: '#f8f8f8' },
  { name: 'White', color: '#ffffff' },
  { name: 'Light Blue', color: '#f0f7ff' },
  { name: 'Light Green', color: '#f0fdf4' },
  { name: 'Light Purple', color: '#faf5ff' },
  { name: 'Cream', color: '#fffbf0' },
]

const ACCENT_PRESETS = [
  { name: 'Blue', color: '#3b82f6' },
  { name: 'Purple', color: '#a855f7' },
  { name: 'Pink', color: '#ec4899' },
  { name: 'Green', color: '#10b981' },
  { name: 'Orange', color: '#f97316' },
  { name: 'Red', color: '#ef4444' },
  { name: 'Teal', color: '#14b8a6' },
  { name: 'Indigo', color: '#6366f1' },
]

export function SettingsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  
  let theme, updateTheme, resetTheme
  try {
    const ctx = useTheme()
    theme = ctx.theme
    updateTheme = ctx.updateTheme
    resetTheme = ctx.resetTheme
  } catch (e) {
    // If not in ThemeProvider, use default values
    return null
  }

  return (
    <>
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-accent hover:bg-accent/90 text-accent-foreground p-3 rounded-full shadow-lg transition-all duration-200 z-40 flex items-center justify-center"
        title="Open settings"
      >
        <Settings className="w-5 h-5" />
      </button>

      {/* Settings Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
              <h2 className="text-xl font-bold text-foreground">Settings</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Font Family */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-foreground">Font Family</label>
                <div className="space-y-2">
                  {FONT_FAMILIES.map((font) => (
                    <label key={font.value} className="flex items-center p-2 rounded hover:bg-muted cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="fontFamily"
                        value={font.value}
                        checked={theme.fontFamily === font.value}
                        onChange={(e) => updateTheme({ fontFamily: e.target.value as any })}
                        className="w-4 h-4 mr-3"
                      />
                      <span className="text-foreground">{font.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-foreground">Font Size</label>
                <div className="space-y-2">
                  {FONT_SIZES.map((size) => (
                    <label key={size.value} className="flex items-center p-2 rounded hover:bg-muted cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="fontSize"
                        value={size.value}
                        checked={theme.fontSize === size.value}
                        onChange={(e) => updateTheme({ fontSize: e.target.value as any })}
                        className="w-4 h-4 mr-3"
                      />
                      <span className="text-foreground">{size.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Background Color */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-foreground">Background Color</label>
                
                {/* Presets */}
                <div className="grid grid-cols-3 gap-2">
                  {BACKGROUND_PRESETS.map((preset) => (
                    <button
                      key={preset.color}
                      onClick={() => updateTheme({ backgroundColor: preset.color })}
                      className={`p-3 rounded border-2 transition-all ${
                        theme.backgroundColor === preset.color
                          ? 'border-accent'
                          : 'border-border hover:border-accent/50'
                      }`}
                      style={{ backgroundColor: preset.color }}
                      title={preset.name}
                    />
                  ))}
                </div>

                {/* Custom Color */}
                <div className="flex items-center gap-2 mt-2">
                  <label className="text-xs text-muted-foreground">Custom:</label>
                  <input
                    type="color"
                    value={theme.backgroundColor}
                    onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.backgroundColor}
                    onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                    className="flex-1 px-2 py-1 text-xs border border-border rounded bg-background text-foreground"
                  />
                </div>
              </div>

              {/* Accent Color */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-foreground">Accent Color</label>
                
                {/* Presets */}
                <div className="grid grid-cols-4 gap-2">
                  {ACCENT_PRESETS.map((preset) => (
                    <button
                      key={preset.color}
                      onClick={() => updateTheme({ accentColor: preset.color })}
                      className={`p-3 rounded border-2 transition-all ${
                        theme.accentColor === preset.color
                          ? 'border-foreground'
                          : 'border-transparent hover:border-border'
                      }`}
                      style={{ backgroundColor: preset.color }}
                      title={preset.name}
                    />
                  ))}
                </div>

                {/* Custom Color */}
                <div className="flex items-center gap-2 mt-2">
                  <label className="text-xs text-muted-foreground">Custom:</label>
                  <input
                    type="color"
                    value={theme.accentColor}
                    onChange={(e) => updateTheme({ accentColor: e.target.value })}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.accentColor}
                    onChange={(e) => updateTheme({ accentColor: e.target.value })}
                    className="flex-1 px-2 py-1 text-xs border border-border rounded bg-background text-foreground"
                  />
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  resetTheme()
                  setIsOpen(false)
                }}
                className="w-full px-4 py-2 text-sm font-medium bg-destructive text-primary-foreground rounded hover:bg-destructive/90 transition-colors"
              >
                Reset to Default
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
