import { useState } from "react"
import { Sparkles, X, RefreshCw, Clock, Hash } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAi } from "@/hooks/ai/use-ai"

interface AiSummaryPanelProps {
  serverId: string
  channelId: string
  channelName?: string
}

type SummaryState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; summary: string; messageCount: number; cached: boolean; generatedAt: string }
  | { status: "error"; message: string }

export const AiSummaryPanel = ({ serverId, channelId, channelName }: AiSummaryPanelProps) => {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<SummaryState>({ status: "idle" })
  const { summarizeChannel } = useAi()

  const fetchSummary = async () => {
    setState({ status: "loading" })
    try {
      const data = await summarizeChannel(serverId, channelId)
      setState({
        status: "success",
        summary: data.summary,
        messageCount: data.message_count,
        cached: data.cached,
        generatedAt: data.generated_at,
      })
    } catch {
      setState({ status: "error", message: "Failed to generate summary. Try again." })
    }
  }

  const handleOpen = () => {
    setOpen(true)
    if (state.status === "idle") fetchSummary()
  }

  const renderSummary = (text: string) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("## ")) {
        return (
          <h3 key={i} className="text-sm font-semibold text-white mt-4 mb-1 first:mt-0">
            {line.replace("## ", "")}
          </h3>
        )
      }
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li key={i} className="text-sm text-zinc-300 ml-3 list-disc">
            {line.replace(/^[-*] /, "")}
          </li>
        )
      }
      if (line.trim() === "") return <br key={i} />
      return (
        <p key={i} className="text-sm text-zinc-300 leading-relaxed">
          {line}
        </p>
      )
    })
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md
          bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 hover:text-indigo-200
          text-xs font-medium transition-all duration-150 border border-indigo-500/20"
      >
        <Sparkles className="w-3.5 h-3.5" />
        Summary
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-95 bg-[#1E1F22] border-zinc-700/50 flex flex-col p-0"
        >
          <SheetHeader className="px-5 pt-5 pb-3 border-b border-zinc-700/50">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2 text-white font-mono text-sm">
                <div className="p-1.5 rounded-md bg-indigo-500/20">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                AI Summary
              </SheetTitle>
              <button
                onClick={() => setOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {channelName && (
              <div className="flex items-center gap-1 mt-1">
                <Hash className="w-3 h-3 text-zinc-500" />
                <span className="text-xs text-zinc-500 font-mono">{channelName}</span>
              </div>
            )}
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            {state.status === "loading" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                  <span className="text-xs text-zinc-500">Gemini is reading the chat…</span>
                </div>
                <Skeleton className="h-4 w-3/4 bg-zinc-700/50" />
                <Skeleton className="h-4 w-full bg-zinc-700/50" />
                <Skeleton className="h-4 w-5/6 bg-zinc-700/50" />
                <Skeleton className="h-4 w-2/3 bg-zinc-700/50 mt-4" />
                <Skeleton className="h-4 w-full bg-zinc-700/50" />
                <Skeleton className="h-4 w-4/5 bg-zinc-700/50" />
              </div>
            )}

            {state.status === "error" && (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center">
                  <X className="w-5 h-5 text-rose-400" />
                </div>
                <p className="text-sm text-zinc-400">{state.message}</p>
                <Button
                  onClick={fetchSummary}
                  size="sm"
                  className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs"
                >
                  Try again
                </Button>
              </div>
            )}

            {state.status === "success" && (
              <div className="space-y-1">
                {renderSummary(state.summary)}
              </div>
            )}
          </div>

          {state.status === "success" && (
            <div className="px-5 py-3 border-t border-zinc-700/50 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-zinc-500" />
                <span className="text-[10px] text-zinc-400">
                  {state.cached ? "Cached" : "Just generated"} · {state.messageCount} messages
                </span>
              </div>
              <button
                onClick={fetchSummary}
                className="flex items-center gap-1 text-[10px] text-zinc-500
                  hover:text-zinc-300 transition"
              >
                <RefreshCw className="w-3 h-3" />
                Refresh
              </button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}