import { useMutation } from "@tanstack/react-query"
import { useAuth } from "@clerk/clerk-react"
import axios from "axios"

export const useMessageEdit=()=>{
  const {getToken}=useAuth() 
  
 return  useMutation({
      mutationFn: async({values,id,channelId,serverId}:{values:{content: string}, id: string, channelId: string, serverId: string})=>{
        const token=await getToken()
        const messageEdit = await axios.patch(`http://localhost:3000/api/v1/messages?messageId=${id}&channelId=${channelId}&serverId=${serverId}`,
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