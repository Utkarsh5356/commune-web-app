import { useState } from "react"
import { Copy, Check, CornerUpRight, Film } from "lucide-react"
import { cn } from "@/lib/utils"
import { renderMarkdown } from "@/lib/render-markdown"
import { UserAvatar } from "@/components/user-avatar"
import { ActionTooltip } from "@/components/action-tooltip"
import type { ChatMessage } from "@/ai-types/commune-ai"
import type { Profile } from "@/hooks/profile/use-currentProfile"

interface MessageBubbleProps {
  msg: ChatMessage
  profile: Profile
  onSend: (text: string) => void
}

const AiIcon = () => (
  <div className="w-8 h-8 rounded-full flex-shrink-0
    bg-gradient-to-br from-indigo-500 to-violet-600
    flex items-center justify-center">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="white"/>
    </svg>
  </div>
)

export const MessageBubble = ({ msg, profile, onSend }: MessageBubbleProps) => {
  const [copied, setCopied] = useState(false)
  const isUser = msg.role === "user"

  const copy = async () => {
    await navigator.clipboard.writeText(msg.text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn(
      "group flex items-start gap-3 py-1 px-4 hover:bg-black/5 transition-colors rounded",
      isUser && "flex-row-reverse"
    )}>
      {/* Avatar */}
      <div className="flex-shrink-0 mt-0.5">
        {isUser
          ? <UserAvatar src={profile.imageUrl} className="h-8 w-8" />
          : <AiIcon />
        }
      </div>

      <div className={cn("flex flex-col max-w-[78%]", isUser && "items-end")}>
        {/* Name + time */}
        <div className={cn("flex items-baseline gap-2 mb-1", isUser && "flex-row-reverse")}>
          <span className={cn(
            "text-sm font-semibold",
            isUser ? "text-zinc-200" : "text-indigo-400"
          )}>
            {isUser ? profile.name : "CommuneAI"}
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">
            {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          {/* RAG badge */}
          {!isUser && msg.rag_context_used && (
            <span className="text-[9px] text-indigo-400/70 font-mono bg-indigo-500/10
              px-1.5 py-0.5 rounded border border-indigo-500/20">
              from history
            </span>
          )}
        </div>

        {/* Media preview */}
        {msg.media_url && msg.media_type === "image" && (
          <img
            src={msg.media_url}
            alt="shared"
            className="rounded-md mb-2 max-h-48 max-w-xs object-cover border border-zinc-700/50"
          />
        )}
        {msg.media_url && msg.media_type === "video" && (
          <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-md
            bg-zinc-700/40 border border-zinc-600/40 w-fit">
            <Film className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-xs text-zinc-400">Video attached</span>
          </div>
        )}

        {/* Message content */}
        <div className={cn(
          "text-sm leading-relaxed",
          isUser
            ? "bg-indigo-600 text-white px-3 py-2 rounded-2xl rounded-tr-sm"
            : "text-zinc-300"
        )}>
          {isUser
            ? <p>{msg.text}</p>
            : <div className="space-y-0.5">{renderMarkdown(msg.text)}</div>
          }
        </div>

        {/* AI message actions */}
        {!isUser && (
          <div className="flex items-center gap-3 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <ActionTooltip label={copied ? "Copied!" : "Copy"} side="bottom">
              <button
                onClick={copy}
                className="flex items-center gap-1 text-[11px] text-zinc-500
                  hover:text-zinc-300 transition"
              >
                {copied
                  ? <Check className="w-3 h-3 text-emerald-400" />
                  : <Copy className="w-3 h-3" />
                }
                {copied ? "Copied" : "Copy"}
              </button>
            </ActionTooltip>

            <span className="text-zinc-700 text-xs">·</span>

            <ActionTooltip label="Send to channel or DM" side="bottom">
              <button
                onClick={() => onSend(msg.text)}
                className="flex items-center gap-1 text-[11px] text-zinc-500
                  hover:text-indigo-400 transition"
              >
                <CornerUpRight className="w-3 h-3" />
                Send
              </button>
            </ActionTooltip>
          </div>
        )}
      </div>
    </div>
  )
}