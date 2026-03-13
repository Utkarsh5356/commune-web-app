import { useMutation } from "@tanstack/react-query"
import { useAuth } from "@clerk/clerk-react"
import axios from "axios"

export const useChatFile=()=>{
  const {getToken}=useAuth() 
  
 return  useMutation({
      mutationFn: async({values,channelId,serverId}:{values:{content?: string, fileUrl?: string}, channelId: string, serverId: string | undefined})=>{
        const newValues={
          ...values,
          content: values.fileUrl
        }
        const token=await getToken()
        const chatFile = await axios.post(`http://localhost:3000/api/v1/messages?serverId=${serverId}&channelId=${channelId}`,
        {
         values: newValues  
        },{    
         headers:{
          'Authorization':`Bearer ${token}`,
          'Content-Type':'application/json'
         }
        })
        return chatFile.data
      },
    })
}