import { useState, useEffect, useRef } from "react"
import { Sparkles, Loader2 } from "lucide-react"
import { useAi } from "@/hooks/ai/use-ai"

interface AiSmartRepliesProps {
  serverId?: string
  channelId?: string
  conversationId?: string
  onSelect: (text: string) => void
  active?: boolean
}

export const AiSmartReplies = ({
  serverId,
  channelId,
  conversationId,
  onSelect,
  active = false,
}: AiSmartRepliesProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fetchedRef = useRef(false)
  const { suggestReplies } = useAi()

  useEffect(() => {
    // Reset when channel changes
    setSuggestions([])
    fetchedRef.current = false
  }, [channelId, conversationId])

  useEffect(() => {
    if (!active) return

    if (debounceRef.current) clearTimeout(debounceRef.current)
    setLoading(true)
    setSuggestions([])

    debounceRef.current = setTimeout(async () => {
      try {
        const data = await suggestReplies({ serverId, channelId, conversationId })
        setSuggestions(data.suggestions)
        fetchedRef.current = true
      } catch {
        // silent fail
      } finally {
        setLoading(false)
      }
    }, 500)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [active])

  const visible = active && (loading || suggestions.length > 0)

  if (!visible) return null

  return (
    <div className="flex items-center gap-2 px-14 pb-1">
      <Sparkles className="w-3 h-3 text-zinc-400 shrink-0" />

      {loading ? (
        <div className="flex items-center gap-1 text-zinc-400">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span className="text-[10px]">Thinking…</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 flex-wrap">
          {suggestions.map((suggestion, i) => (
            <button
              key={i}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault()
                onSelect(suggestion)
                setSuggestions([])
              }}
              className="px-2.5 py-0.5 rounded-full text-[11px] font-medium
                bg-zinc-700/60 hover:bg-indigo-500/20 text-zinc-200 hover:text-indigo-300
                border border-zinc-700 hover:border-indigo-500/40
                transition-all duration-150 cursor-pointer whitespace-nowrap"
            >
              {suggestion}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSuggestions([])}
            className="text-[10px] text-zinc-200 hover:text-zinc-500 transition ml-1"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}