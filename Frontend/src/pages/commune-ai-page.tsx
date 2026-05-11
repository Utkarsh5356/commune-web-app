import { useState, useRef, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { useAllServers } from "@/hooks/server/use-all-servers"
import { useAi } from "@/hooks/ai/use-ai"
import { useFileUpload } from "@/hooks/ai/use-file-upload"
import { useRagScope } from "@/hooks/ai/use-rag-scope"
import { CommuneAiHeader } from "@/components/ai/commune-ai-header"
import { MessageBubble } from "@/components/ai/message-bubble"
import { TypingIndicator } from "@/components/typing-indicator"
import { ChatInput } from "@/components/ai/chat-input"
import { SendToModal } from "@/components/ai/send-to-modal"
import type { ChatMessage, HistoryMessage } from "@/ai-types/commune-ai"
import type { Profile } from "@/hooks/profile/use-currentProfile"

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "model",
  text: "Hey! I'm **CommuneAI** — your AI assistant powered by Gemini.\n\nI can:\n- Answer any question from your text\n- **Analyse images** you share\n- **Summarise videos** with timestamps and key points\n- Help you **draft messages** for your team channels\n\nSend a message, upload an image, or drop a video to get started!",
  timestamp: new Date(),
}

export const CommuneAiPage = () => {
  const profile = useOutletContext<Profile>()
  const { data: servers } = useAllServers()
  const { communeAiChat } = useAi()

  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [sendTarget, setSendTarget] = useState<string | null>(null)

  const bottomRef = useRef<HTMLDivElement>(null)

  const { pendingMedia, uploadProgress, uploading, handleFile, clearMedia } = useFileUpload()
  const { selectedServerId, selectedChannelId, indexing, ragEnabled, selectServer, selectChannel } = useRagScope(setMessages)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const buildHistory = (): HistoryMessage[] =>
    messages
      .filter(m => m.id !== "welcome")
      .map(m => ({
        role: m.role,
        text: m.text,
        media_url: m.media_url,
        media_type: m.media_type,
      }))

  const handleSend = async () => {
    const text = input.trim()
    if (!text && !pendingMedia) return
    if (loading) return

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: text || (pendingMedia?.type === "video" ? "Summarise this video" : "What's in this image?"),
      media_url: pendingMedia?.url,
      media_type: pendingMedia?.type,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput("")
    clearMedia()
    setLoading(true)

    try {
      const data = await communeAiChat({
        message: userMsg.text,
        history: buildHistory(),
        media_url: userMsg.media_url,
        media_type: userMsg.media_type,
        channel_id: selectedChannelId ?? undefined,
        server_id: selectedServerId ?? undefined,
      })

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: data.reply,
        has_summary: data.has_summary,
        has_image_analysis: data.has_image_analysis,
        rag_context_used: data.rag_context_used,
        timestamp: new Date(),
      }])
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: "Sorry, something went wrong. Please try again.",
        timestamp: new Date(),
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col pl-18 h-screen bg-[#313338]">
      <CommuneAiHeader
        servers={servers}
        selectedServerId={selectedServerId}
        selectedChannelId={selectedChannelId}
        ragEnabled={ragEnabled}
        indexing={indexing}
        onSelectServer={selectServer}
        onSelectChannel={selectChannel}
      />

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            profile={profile}
            onSend={setSendTarget}
          />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      <ChatInput
        input={input}
        loading={loading}
        uploading={uploading}
        uploadProgress={uploadProgress}
        pendingMedia={pendingMedia}
        onInputChange={setInput}
        onSend={handleSend}
        onFileSelect={handleFile}
        onClearMedia={clearMedia}
      />

      {sendTarget && profile && (
        <SendToModal
          text={sendTarget}
          profile={profile}
          onClose={() => setSendTarget(null)}
        />
      )}
    </div>
  )
}