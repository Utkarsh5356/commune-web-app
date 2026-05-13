import { useMutation } from "@tanstack/react-query"
import { useAuth } from "@clerk/clerk-react"
import axios from "axios"

interface ChatInput{
  id: string
  content: string
  fileUrl: string
  memberId: string
  channelId: string
  deleted: boolean
} 

export const useChatInput=()=>{
  const {getToken}=useAuth() 
  
 return  useMutation({
      mutationFn: async({values,query}:{values:{content: string, fileUrl?: string}, query:Record<string,string>})=>{
        const token=await getToken()
        const chatInput = await axios.post<ChatInput>(`http://localhost:3000/api/v1/messages?serverId=${query.serverId}&channelId=${query.channelId}`,
        {
         values
        },{    
         headers:{
          'Authorization':`Bearer ${token}`,
          'Content-Type':'application/json'
         }
        })

        await axios.post("http://127.0.0.1:8080/api/v1/ai/commune-ai/index", {
          message_id: chatInput.data.id,
          channel_id: query.channelId,
          content: values.content
        }, {
         headers: { Authorization: `Bearer ${token}` }
        }).catch(() => {}) // silent fail — indexing is non-critical

        return chatInput.data
      },
    })
}