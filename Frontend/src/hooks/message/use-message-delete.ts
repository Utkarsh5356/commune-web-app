import { useMutation } from "@tanstack/react-query"
import { useAuth } from "@clerk/clerk-react"
import axios from "axios"

export const useMessageDelete=()=>{
  const {getToken}=useAuth() 
  
 return  useMutation({
      mutationFn: async({id,query}:{id: string | undefined, query: Record<string,string> | undefined})=>{
        const token=await getToken()
        const messageDelete = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/messages?messageId=${id}&channelId=${query?.channelId}&serverId=${query?.serverId}`,
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