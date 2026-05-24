import { useRef } from "react"
import { Paperclip, Send, Loader2, ImageIcon, Film, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ActionTooltip } from "@/components/action-tooltip"
import { EmojiPicker } from "@/components/emoji-picker"
import type { PendingMedia } from "@/hooks/ai/use-file-upload"

interface ChatInputProps {
  input: string
  loading: boolean
  uploading: boolean
  uploadProgress: number
  pendingMedia: PendingMedia | null
  onInputChange: (value: string) => void
  onSend: () => void
  onFileSelect: (file: File) => void
  onClearMedia: () => void
}

export const ChatInput = ({
  input,
  loading,
  uploading,
  uploadProgress,
  pendingMedia,
  onInputChange,
  onSend,
  onFileSelect,
  onClearMedia,
}: ChatInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  const canSend = (input.trim() || pendingMedia) && !loading && !uploading

  return (
    <div className="px-4 pb-6 shrink-0">
      {pendingMedia && (
        <div className="flex items-center gap-2 mb-2 px-3 py-1.5 rounded-md w-fit
          bg-zinc-700/50 border border-zinc-600/50">
          {pendingMedia.type === "image"
            ? <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
            : <Film className="w-3.5 h-3.5 text-violet-400" />
          }
          <span className="text-xs text-zinc-300 max-w-55 truncate">{pendingMedia.name}</span>
          <button onClick={onClearMedia} className="text-zinc-500 hover:text-zinc-300 transition ml-1">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {uploading && (
        <div className="flex items-center gap-2 mb-2">
          <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin shrink-0" />
          <div className="flex-1 h-1 bg-zinc-700 rounded-full overflow-hidden max-w-50">
            <div className="h-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }} />
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">{uploadProgress}%</span>
        </div>
      )}

      <div className="relative flex items-end bg-zinc-700/75 rounded-lg border border-zinc-600/30
        focus-within:border-zinc-500/50 transition-colors">

        <ActionTooltip label="Upload image or video" side="top">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute left-3 bottom-4 h-6 w-6 rounded-full
              bg-zinc-400 hover:bg-zinc-300 transition flex items-center justify-center
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Paperclip className="w-3.5 h-3.5 text-[#313338]" />
          </button>
        </ActionTooltip>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) onFileSelect(f); e.target.value = "" }}
        />

        <textarea
          value={input}
          onChange={e => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading || uploading}
          placeholder="Ask CommuneAI anything…"
          rows={1}
          className="flex-1 bg-transparent text-zinc-200 font-mono text-sm
            placeholder:text-zinc-500 px-14 py-4 outline-none resize-none
            leading-relaxed max-h-36 overflow-y-auto disabled:opacity-50"
          style={{ scrollbarWidth: "none" }}
        />

        <div className="absolute right-3 bottom-4 flex items-center gap-2">
          <EmojiPicker onChange={(emoji: string) => onInputChange(input + emoji)} />
          <ActionTooltip label="Send message" side="top">
            <button
              type="button"
              onClick={onSend}
              disabled={!canSend}
              className={cn(
                "h-6 w-6 rounded flex items-center justify-center transition-all",
                canSend
                  ? "bg-indigo-500 hover:bg-indigo-400 text-white"
                  : "bg-zinc-600/50 text-zinc-500 cursor-not-allowed"
              )}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </ActionTooltip>
        </div>
      </div>

      <p className="text-[10px] text-zinc-400 mt-1.5 text-center font-mono">
        Enter to send · Shift+Enter for new line · Images and videos up to 500MB
      </p>
    </div>
  )
}