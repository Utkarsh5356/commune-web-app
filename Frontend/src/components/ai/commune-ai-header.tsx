import { Loader2, ChevronDown } from "lucide-react"
import type { Servers } from "@/hooks/server/use-all-servers"

interface CommuneAiHeaderProps {
  servers?: Servers[]
  selectedServerId: string | null
  selectedChannelId: string | null
  ragEnabled: boolean
  indexing: boolean
  onSelectServer: (id: string | null) => void
  onSelectChannel: (id: string | null) => void
}

export const CommuneAiHeader = ({
  servers,
  selectedServerId,
  selectedChannelId,
  indexing,
  onSelectServer,
  onSelectChannel,
}: CommuneAiHeaderProps) => {
  const selectedServer = servers?.find(s => s.id === selectedServerId)
  const textChannels = selectedServer?.channels?.filter((ch: any) => ch.type === "TEXT") ?? []

  return (
    <div className="shrink-0 border-b-2 border-neutral-800 bg-[#313338]">
      {/* Title row */}
      <div className="flex items-center h-12 px-4 gap-3">
        <div className="w-6 h-6 rounded-full bg-linear-to-br from-indigo-500 to-violet-600
          flex items-center justify-center shrink-0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="white"/>
          </svg>
        </div>
 
        <p className="font-mono font-semibold text-md text-white">CommuneAI</p>
 
        <div className="ml-auto flex items-center gap-3">
          {indexing && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Indexing…</span>
            </div>
          )}
        </div>
      </div>
 
      {/* RAG scope row */}
      <div className="flex items-center gap-2 px-4 pb-2.5">
        <span className="text-[11px] text-zinc-500 font-mono">context:</span>
 
        {/* Server select */}
        <div className="relative">
          <select
            value={selectedServerId ?? ""}
            onChange={e => {
              onSelectServer(e.target.value || null)
              onSelectChannel(null)
            }}
            className="appearance-none pl-2 pr-6 py-1 rounded text-xs bg-zinc-700/60
              border border-zinc-600/50 text-zinc-300 focus:outline-none
              focus:border-indigo-500/60 transition cursor-pointer"
          >
            <option value="">No context (general AI)</option>
            {servers?.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2
            w-3 h-3 text-zinc-500 pointer-events-none" />
        </div>
 
        {/* Channel select — shown only when server selected */}
        {selectedServerId && (
          <>
            <span className="text-zinc-600">/</span>
            <div className="relative">
              <select
                value={selectedChannelId ?? ""}
                onChange={e => onSelectChannel(e.target.value || null)}
                className="appearance-none pl-2 pr-6 py-1 rounded text-xs bg-zinc-700/60
                  border border-zinc-600/50 text-zinc-300 focus:outline-none
                  focus:border-indigo-500/60 transition cursor-pointer"
              >
                <option value="">All channels</option>
                {textChannels.map((ch: any) => (
                  <option key={ch.id} value={ch.id}>#{ch.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2
                w-3 h-3 text-zinc-500 pointer-events-none" />
            </div>
          </>
        )}
      </div>
    </div>
  )
}