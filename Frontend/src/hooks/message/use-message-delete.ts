import { useMutation } from "@tanstack/react-query"
import { useAuth } from "@clerk/clerk-react"
import axios from "axios"

export const useMessageDelete=()=>{
  const {getToken}=useAuth() 
  
 return  useMutation({
      mutationFn: async({id,channelId,serverId}:{id: string | undefined, channelId: string | undefined, serverId: string | undefined})=>{
        const token=await getToken()
        const messageDelete = await axios.delete(`http://localhost:3000/api/v1/messages?messageId=${id}&channelId=${channelId}&serverId=${serverId}`,
        {    
         headers:{
          'Authorization':`Bearer ${token}`,
          'Content-Type':'application/json'
         }
        })
        return messageDelete.data
      },
    })
}