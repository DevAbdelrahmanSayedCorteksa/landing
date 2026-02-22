'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Plus, Lightbulb,
  ChevronDown, Check, Sparkles, Zap, Brain, Bolt,
  SendHorizontal
} from 'lucide-react'
import Image from 'next/image'

// TYPES
interface Model {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  badge?: string
}

// MODEL SELECTOR
const models: Model[] = [
  { id: 'sonnet-4.5', name: 'Sonnet 4.5', description: 'Fast & intelligent', icon: <Zap className="size-4 text-blue-400" />, badge: 'Default' },
  { id: 'opus-4.5', name: 'Opus 4.5', description: 'Most capable', icon: <Sparkles className="size-4 text-purple-400" />, badge: 'Pro' },
  { id: 'haiku-4.5', name: 'Haiku 4.5', description: 'Lightning fast', icon: <Brain className="size-4 text-emerald-400" /> },
  { id: 'gpt-4o', name: 'GPT-4o', description: 'OpenAI flagship', icon: <Sparkles className="size-4 text-green-400" /> },
  { id: 'gemini-2.0', name: 'Gemini 2.0', description: 'Google AI', icon: <Brain className="size-4 text-cyan-400" /> }
]

function ModelSelector({ selectedModel = 'sonnet-4.5', onModelChange }: { 
  selectedModel?: string
  onModelChange?: (model: Model) => void 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState(models.find(m => m.id === selectedModel) || models[0])

  const handleSelect = (model: Model) => {
    setSelected(model)
    setIsOpen(false)
    onModelChange?.(model)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-neutral-100 dark:hover:bg-white/5 active:scale-95"
      >
        {selected.icon}
        <span>{selected.name}</span>
        <ChevronDown className={`size-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute bottom-full left-0 mb-2 z-50 min-w-[220px] bg-white/95 dark:bg-[#1a1a1e]/95 backdrop-blur-xl border border-neutral-200 dark:border-white/10 rounded-xl shadow-2xl shadow-neutral-200/50 dark:shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="p-1.5">
              <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Select Model
              </div>
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleSelect(model)}
                  className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-left transition-all duration-150 ${
                    selected.id === model.id ? 'bg-neutral-100 text-foreground dark:bg-white/10 dark:text-white' : 'text-muted-foreground hover:bg-neutral-100 hover:text-foreground dark:hover:bg-white/5 dark:hover:text-white'
                  }`}
                >
                  <div className="flex-shrink-0">{model.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{model.name}</span>
                      {model.badge && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                          model.badge === 'Pro' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {model.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-muted-foreground">{model.description}</span>
                  </div>
                  {selected.id === model.id && <Check className="size-4 text-blue-400 flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// CHAT INPUT
function ChatInput({ onSend, placeholder = "What do you want to build?" }: {
  onSend?: (message: string) => void
  placeholder?: string
}) {
  const [message, setMessage] = useState('')
  const [showAttachMenu, setShowAttachMenu] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [message])

  const handleSubmit = () => {
    if (message.trim()) {
      onSend?.(message)
      setMessage('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="relative w-full max-w-[680px] mx-auto">
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-neutral-200 dark:from-white/[0.08] to-transparent pointer-events-none" />
      <div className="relative rounded-2xl bg-white dark:bg-[#1e1e22] ring-1 ring-neutral-200 dark:ring-white/[0.08] shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_2px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_2px_20px_rgba(0,0,0,0.4)]">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full resize-none bg-transparent text-[15px] text-foreground placeholder-muted-foreground px-5 pt-5 pb-3 focus:outline-none min-h-[80px] max-h-[200px]"
            style={{ height: '80px' }}
          />
        </div>

        <div className="flex items-center justify-between px-3 pb-3 pt-1">
          <div className="flex items-center gap-1">
            <div className="relative">
              <button
                disabled
                className="flex items-center justify-center size-8 rounded-full bg-neutral-100 dark:bg-white/[0.08] text-muted-foreground opacity-50 cursor-not-allowed"
              >
                <Plus className="size-4" />
              </button>
            </div>

            {/* Cortex AI Model Selector */}
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-neutral-100 dark:hover:bg-white/5 cursor-default">
              <div className="size-4 rounded-md bg-gradient-to-br from-[#7c3aed]/20 to-[#7c3aed]/10 flex items-center justify-center p-0.5">
                <Image
                  src="/Corteksa.svg"
                  alt="Cortex AI"
                  width={12}
                  height={12}
                  className="w-full h-full"
                />
              </div>
              <span>Cortex AI</span>
              <ChevronDown className="size-3.5 opacity-50" />
            </button>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-neutral-100 dark:hover:bg-white/5 transition-all duration-200">
              <Lightbulb className="size-4" />
              <span className="hidden sm:inline">Plan</span>
            </button>

            <button
              onClick={handleSubmit}
              disabled={!message.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-[#7c3aed] hover:bg-[#8b5cf6] text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shadow-[0_0_20px_rgba(124,58,237,0.3)]"
            >
              <span className="hidden sm:inline">Build now</span>
              <SendHorizontal className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Ray Background
function RayBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none">
      <div className="absolute inset-0 bg-neutral-50 dark:bg-[#0f0f0f]" />

      {/* Light mode: softer purple glow, no dark edges */}
      <div
        className="absolute left-1/2 -translate-x-1/2 w-[4000px] h-[1800px] sm:w-[6000px] dark:hidden"
        style={{
          background: `radial-gradient(circle at center 800px, rgba(124, 58, 237, 0.35) 0%, rgba(124, 58, 237, 0.15) 14%, rgba(124, 58, 237, 0.07) 18%, rgba(124, 58, 237, 0.02) 22%, transparent 25%)`
        }}
      />

      {/* Dark mode: original intense glow */}
      <div
        className="absolute left-1/2 -translate-x-1/2 w-[4000px] h-[1800px] sm:w-[6000px] hidden dark:block"
        style={{
          background: `radial-gradient(circle at center 800px, rgba(124, 58, 237, 0.8) 0%, rgba(124, 58, 237, 0.35) 14%, rgba(124, 58, 237, 0.18) 18%, rgba(124, 58, 237, 0.08) 22%, rgba(17, 17, 20, 0.2) 25%)`
        }}
      />

      {/* Light mode: subtle bottom arc glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[2000px] h-[600px] dark:hidden"
        style={{
          background: `radial-gradient(ellipse at center bottom, rgba(124, 58, 237, 0.12) 0%, rgba(124, 58, 237, 0.04) 40%, transparent 70%)`
        }}
      />

      {/* Planet circles — dark mode only (inline dark colors can't be theme-switched) */}
      <div
        className="absolute top-[175px] left-1/2 w-[1600px] h-[1600px] sm:top-1/2 sm:w-[3043px] sm:h-[2865px] hidden dark:block"
        style={{ transform: 'translate(-50%) rotate(180deg)' }}
      >
        <div className="absolute w-full h-full rounded-full -mt-[13px]" style={{ background: 'radial-gradient(43.89% 25.74% at 50.02% 97.24%, #111114 0%, #0f0f0f 100%)', border: '16px solid white', transform: 'rotate(180deg)', zIndex: 5 }} />
        <div className="absolute w-full h-full rounded-full bg-[#0f0f0f] -mt-[11px]" style={{ border: '23px solid #d8b4fe', transform: 'rotate(180deg)', zIndex: 4 }} />
        <div className="absolute w-full h-full rounded-full bg-[#0f0f0f] -mt-[8px]" style={{ border: '23px solid #c084fc', transform: 'rotate(180deg)', zIndex: 3 }} />
        <div className="absolute w-full h-full rounded-full bg-[#0f0f0f] -mt-[4px]" style={{ border: '23px solid #a855f7', transform: 'rotate(180deg)', zIndex: 2 }} />
        <div className="absolute w-full h-full rounded-full bg-[#0f0f0f]" style={{ border: '20px solid #7c3aed', boxShadow: '0 -15px 24.8px rgba(124, 58, 237, 0.6)', transform: 'rotate(180deg)', zIndex: 1 }} />
      </div>
    </div>
  )
}

// ANNOUNCEMENT BADGE COMPONENT
function AnnouncementBadge({ text, href = "#" }: { text: string; href?: string }) {
  const content = (
    <>
      <span className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none opacity-70 mix-blend-overlay" style={{ background: 'radial-gradient(ellipse at center top, rgba(255, 255, 255, 0.15) 0%, transparent 70%)' }} />
      <span className="absolute -top-px left-1/2 -translate-x-1/2 h-[2px] w-[100px] opacity-60" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(37, 119, 255, 0.8) 20%, rgba(126, 93, 225, 0.8) 50%, rgba(59, 130, 246, 0.8) 80%, transparent 100%)', filter: 'blur(0.5px)' }} />
      <Bolt className="size-4 relative z-10 text-white" />
      <span className="relative z-10 text-white font-medium">{text}</span>
    </>
  )

  const className = "relative inline-flex items-center gap-2 px-5 py-2 min-h-[40px] rounded-full text-sm overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
  const style = {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
    backdropFilter: 'blur(20px) saturate(140%)',
    boxShadow: 'inset 0 1px rgba(255,255,255,0.2), inset 0 -1px rgba(0,0,0,0.1), 0 8px 32px -8px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.08)'
  }

  return href !== '#' ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={style}>{content}</a>
  ) : (
    <button className={className} style={style}>{content}</button>
  )
}

// PROMPT SUGGESTIONS COMPONENT
function PromptSuggestions({ suggestions, onSelect }: { suggestions?: string[]; onSelect?: (prompt: string) => void }) {
  if (!suggestions || suggestions.length === 0) return null
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 px-4">
      {suggestions.map((prompt, i) => (
        <button
          key={i}
          onClick={() => onSelect?.(prompt)}
          className="px-4 py-2 rounded-full text-xs font-medium border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.03] hover:bg-neutral-100 dark:hover:bg-white/[0.08] text-muted-foreground hover:text-foreground transition-all duration-200 active:scale-95"
        >
          {prompt}
        </button>
      ))}
    </div>
  )
}

// MAIN BOLT CHAT COMPONENT
interface BoltChatProps {
  title?: string
  subtitle?: string
  announcementText?: string
  announcementHref?: string
  placeholder?: string
  suggestions?: string[]
  onSend?: (message: string) => void
}

export function BoltStyleChat({
  title = "What will you",
  subtitle = "Create stunning apps & websites by chatting with AI.",
  announcementText = "Introducing Bolt V2",
  announcementHref = "#",
  placeholder = "What do you want to build?",
  suggestions,
  onSend,
}: BoltChatProps) {
  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full overflow-hidden bg-neutral-50 dark:bg-[#0f0f0f]">
      <RayBackground />
      {/* Content container */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-full h-full overflow-hidden">
        {/* Title section */}
        <div className="text-center mb-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-1">
            {title}{' '}
            <span className="bg-gradient-to-b from-[#a855f7] via-[#7c3aed] to-[#c084fc] dark:to-white bg-clip-text text-transparent italic">
              build
            </span>
            {' '}today?
          </h1>
          <p className="text-base font-semibold sm:text-lg text-muted-foreground">{subtitle}</p>
        </div>

        {/* Chat input */}
        <div className="w-full max-w-[700px] mb-6 sm:mb-8 mt-2">
          <ChatInput placeholder={placeholder} onSend={onSend} />
        </div>

        {/* Prompt suggestions */}
        <PromptSuggestions suggestions={suggestions} onSelect={onSend} />
      </div>
    </div>
  )
}
