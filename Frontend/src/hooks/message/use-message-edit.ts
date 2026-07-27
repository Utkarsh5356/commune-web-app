import { useMutation } from "@tanstack/react-query"
import { useAuth } from "@clerk/clerk-react"
import axios from "axios"

export const useMessageEdit=()=>{
  const {getToken}=useAuth() 
  
 return  useMutation({
      mutationFn: async({values,id,query}:{values:{content: string}, id: string,query: Record<string,string>})=>{
        const token=await getToken()
        const messageEdit = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/messages?messageId=${id}&channelId=${query.channelId}&serverId=${query.serverId}`,
        {
         values
        },{    
         headers:{
          'Authorization':`Bearer ${token}`,
          'Content-Type':'application/json'
         }
        })
        return messageEdit.data
      },
    })
}