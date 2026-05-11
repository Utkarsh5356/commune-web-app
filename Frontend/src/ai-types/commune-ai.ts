export type MediaType = "image" | "video"

export interface HistoryMessage {
    role: "user" | "model"
    text: string
    media_url?: string
    media_type?: MediaType  
}

export interface ChatMessage {
    id: string
    role: "user" | "model"
    text: string
    media_url?: string
    media_type?: MediaType
    has_summary?: boolean
    has_image_analysis?: boolean
    rag_context_used?: boolean
    timestamp: Date
}

export interface SendTarget {
    type: "channel" | "dm"
    id: string
    label: string
    serverId?: string
}