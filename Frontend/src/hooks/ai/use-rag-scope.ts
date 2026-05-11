import { useState } from "react"
import { useAi } from "@/hooks/ai/use-ai"
import type { ChatMessage } from "@/ai-types/commune-ai"

export const useRagScope = (
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) => {
  const { indexChannel } = useAi()
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null)
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null)
  const [indexing, setIndexing] = useState(false)
  const [ragEnabled, setRagEnabled] = useState(false)

  const selectServer = (serverId: string | null) => {
    setSelectedServerId(serverId)
    setSelectedChannelId(null)
    setRagEnabled(false)
  }

  const selectChannel = async (channelId: string | null) => {
    setSelectedChannelId(channelId)
    if (!channelId || !selectedServerId) return

    setIndexing(true)
    try {
      const result = await indexChannel(channelId, selectedServerId)
      setRagEnabled(true)
      if (result.indexed > 0) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: "model" as const,
          text: `✓ Indexed **${result.indexed}** messages from this channel. I can now answer questions about your conversations here.`,
          timestamp: new Date(),
        }])
      }
    } catch {
      // silent fail — RAG is enhancement, not blocker
    } finally {
      setIndexing(false)
    }
  }

  return {
    selectedServerId,
    selectedChannelId,
    indexing,
    ragEnabled,
    selectServer,
    selectChannel,
  }
}