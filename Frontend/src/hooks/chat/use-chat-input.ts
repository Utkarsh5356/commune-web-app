import { useMutation } from "@tanstack/react-query"
import { useAuth } from "@clerk/clerk-react"
import axios from "axios"

export const useChatInput=()=>{
  const {getToken}=useAuth() 
  
 return  useMutation({
      mutationFn: async({values,channelId,serverId}:{values:{content: string, fileUrl?: string}, channelId: string, serverId: string | undefined})=>{
        const token=await getToken()
        const chatInput = await axios.post(`http://localhost:3000/api/v1/messages?serverId=${serverId}&channelId=${channelId}`,
        {
         values
        },{    
         headers:{
          'Authorization':`Bearer ${token}`,
          'Content-Type':'application/json'
         }
        })
        return chatInput.data
      },
    })
}