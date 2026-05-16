import { useAuth } from "@clerk/clerk-react"
import axios from "axios"

const AI_BASE = "http://127.0.0.1:8080/api/v1/ai"

export const useAi = () => {
  const { getToken } = useAuth()

    const authHeaders = async () => {
       const token = await getToken()
       return {
         "Authorization": `Bearer ${token}`,
         "Content-Type": "application/json"
       } 
    }


    // Commune RAG chatbot

    const communeAiChat = async (payload: {
      message: string
      history: {
        role: "user" | "model"
        text: string
        media_url?: string
        media_type?: "image" | "video"
      }[]
      media_url?: string
      media_type?: "image" | "video"
      channel_id?: string
      server_id?: string 
    }) => {
      const headers = await authHeaders()
      const res = await axios.post(`${AI_BASE}/commune-ai/chat`, payload, {headers})

      return res.data as {
        reply: string
        has_summary: boolean
        has_image_analysis: boolean
        rag_context_used: boolean
      }
    }

    // Index a single message

    const indexMessage = async (payload: {
      message_id: string
      channel_id: string
      content: string
    }) => {
       const headers = await authHeaders()
       const res = await axios.post(`${AI_BASE}/commune-ai/index`, payload, {headers})
       
       return res.data as {
        indexed: boolean
        message_id: string
       }
    }

    // Bulk index a channel

    const indexChannel = async (channelId: string, serverId: string) => {
        const headers = await authHeaders()
        const res = await axios.post(`${AI_BASE}/commune-ai/index-channel`, 
            {channel_id: channelId, server_id: serverId},
            {headers}
        )

        return res.data as {
          indexed: number
          channel_id: string
        }
    }
    
    // Channel summary (chat header "Summary" button)
    const summarizeChannel = async (serverId: string, channelId: string) => {
      const headers = await authHeaders()
      const res = await axios.post(
        `${AI_BASE}/summarize-channel?serverId=${serverId}&channelId=${channelId}`,
        {},
        { headers }
      )
      return res.data as { summary: string; message_count: number; cached: boolean; generated_at: string }
    }
   
    // Smart reply pills (above chat input) 
    const suggestReplies = async (params: {
      serverId?: string
      channelId?: string
      conversationId?: string
    }) => {
      const headers = await authHeaders()
      const query = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v != null)) as Record<string, string>
      ).toString()
      const res = await axios.post(`${AI_BASE}/suggest-replies?${query}`, {}, { headers })
      return res.data as { suggestions: string[] }
    }

    return { communeAiChat, indexMessage, indexChannel, summarizeChannel, suggestReplies }
}