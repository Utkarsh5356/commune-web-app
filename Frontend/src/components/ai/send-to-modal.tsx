import { useState } from "react"
import { useAuth } from "@clerk/clerk-react"
import { useAllServers } from "@/hooks/server/use-all-servers"
import { cn } from "@/lib/utils"
import axios from "axios"
import { X, CornerUpRight, ChevronDown, Hash, MessageSquare, Check } from "lucide-react"
import type { SendTarget } from "@/ai-types/commune-ai"
import type { Profile } from "@/hooks/profile/use-currentProfile"

interface SendToModalProps {
  text: string
  profile: Profile
  onClose: () => void
}

export const SendToModal = ({ text, profile, onClose }: SendToModalProps) => {
  const { data: servers } = useAllServers()
  const { getToken } = useAuth()
  const [selected, setSelected] = useState<SendTarget | null>(null)
  const [serverChannels, setServerChannels] = useState<Record<string, any[]>>({})
  const [serverMembers, setServerMembers] = useState<Record<string, any[]>>({})
  const [expandedServer, setExpandedServer] = useState<string | null>(null)
  const [tab, setTab] = useState<"channels" | "dms">("channels")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const loadServer = async (serverId: string) => {
    if (serverChannels[serverId]) return
    const token = await getToken()
    const headers = { Authorization: `Bearer ${token}` }
    const [ch, mb] = await Promise.all([
      axios.get(`http://localhost:3000/api/v1/channel/all?serverId=${serverId}`, { headers }),
      axios.get(`http://localhost:3000/api/v1/member/all?serverId=${serverId}`, { headers }),
    ])
    setServerChannels(prev => ({ ...prev, [serverId]: ch.data }))
    setServerMembers(prev => ({ ...prev, [serverId]: mb.data }))
  }

  const toggleServer = async (serverId: string) => {
    setExpandedServer(prev => prev === serverId ? null : serverId)
    await loadServer(serverId)
  }

  const handleSend = async () => {
    if (!selected) return
    setSending(true)
    try {
      const token = await getToken()
      const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      const content = `**CommuneAI**\n\n${text}`

      if (selected.type === "channel" && selected.serverId) {
        await axios.post(
          `http://localhost:3000/api/v1/messages?serverId=${selected.serverId}&channelId=${selected.id}`,
          { content }, { headers }
        )
      } else {
        await axios.post(
          `http://localhost:3000/api/v1/direct-messages?memberId=${selected.id}`,
          { content }, { headers }
        )
      }
      setSent(true)
      setTimeout(onClose, 1200)
    } catch {
      alert("Failed to send. Please try again.")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-[400px] max-h-[560px] bg-[#1E1F22] rounded-lg border border-zinc-700/60
        shadow-xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3
          border-b border-zinc-700/50 bg-[#2B2D31]">
          <div className="flex items-center gap-2">
            <CornerUpRight className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white font-mono">Send to…</h3>
          </div>
          <button onClick={onClose}
            className="text-zinc-400 hover:text-white transition rounded p-1 hover:bg-zinc-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preview */}
        <div className="mx-4 mt-3 p-3 rounded bg-zinc-800/80 border border-zinc-700/40 max-h-20 overflow-y-auto">
          <p className="text-xs text-zinc-400 leading-relaxed font-mono">
            {text.slice(0, 180)}{text.length > 180 ? "…" : ""}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex mx-4 mt-3 bg-zinc-800/60 rounded p-0.5 border border-zinc-700/40">
          {(["channels", "dms"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={cn(
                "flex-1 py-1.5 rounded text-xs font-medium transition",
                tab === t
                  ? "bg-indigo-600 text-white"
                  : "text-zinc-400 hover:text-zinc-200"
              )}>
              {t === "channels" ? "# Channels" : "@ Direct Messages"}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
          {servers?.map(server => (
            <div key={server.id}>
              <button
                onClick={() => toggleServer(server.id)}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded
                  hover:bg-zinc-700/50 transition text-left">
                <span className="text-xs font-semibold text-zinc-300 flex-1 truncate">{server.name}</span>
                <ChevronDown className={cn(
                  "w-3.5 h-3.5 text-zinc-500 transition-transform shrink-0",
                  expandedServer === server.id && "rotate-180"
                )} />
              </button>

              {expandedServer === server.id && (
                <div className="ml-3 mb-1 space-y-0.5">
                  {tab === "channels"
                    ? (serverChannels[server.id] || [])
                        .filter((ch: any) => ch.type === "TEXT")
                        .map((ch: any) => {
                          const target: SendTarget = { type: "channel", id: ch.id, label: ch.name, serverId: server.id }
                          const isSelected = selected?.id === ch.id
                          return (
                            <button key={ch.id}
                              onClick={() => setSelected(isSelected ? null : target)}
                              className={cn(
                                "w-full flex items-center gap-2 px-3 py-1.5 rounded transition text-left",
                                isSelected
                                  ? "bg-indigo-500/20 text-indigo-300"
                                  : "text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-200"
                              )}>
                              <Hash className="w-3.5 h-3.5 shrink-0" />
                              <span className="text-xs truncate flex-1">{ch.name}</span>
                              {isSelected && <Check className="w-3 h-3 text-indigo-400 shrink-0" />}
                            </button>
                          )
                        })
                    : (serverMembers[server.id] || [])
                        .filter((m: any) => m.profileId !== profile.id)
                        .map((m: any) => {
                          const target: SendTarget = { type: "dm", id: m.id, label: m.profile?.name || "Member" }
                          const isSelected = selected?.id === m.id
                          return (
                            <button key={m.id}
                              onClick={() => setSelected(isSelected ? null : target)}
                              className={cn(
                                "w-full flex items-center gap-2 px-3 py-1.5 rounded transition text-left",
                                isSelected
                                  ? "bg-indigo-500/20 text-indigo-300"
                                  : "text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-200"
                              )}>
                              <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                              <span className="text-xs truncate flex-1">{m.profile?.name}</span>
                              {isSelected && <Check className="w-3 h-3 text-indigo-400 shrink-0" />}
                            </button>
                          )
                        })
                  }
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Send button */}
        <div className="px-4 py-3 border-t border-zinc-700/50">
          <button
            onClick={handleSend}
            disabled={!selected || sending || sent}
            className={cn(
              "w-full py-2 rounded text-sm font-semibold transition-all",
              sent
                ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                : selected
                  ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                  : "bg-zinc-700/50 text-zinc-500 cursor-not-allowed"
            )}>
            {sent ? "✓ Sent!" : sending ? "Sending…" : selected ? `Send to #${selected.label}` : "Select a destination"}
          </button>
        </div>
      </div>
    </div>
  )
}