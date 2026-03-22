import { useMutation } from "@tanstack/react-query"
import { useAuth } from "@clerk/clerk-react"
import axios from "axios"

export const useChatInput=()=>{
  const {getToken}=useAuth() 
  
 return  useMutation({
      mutationFn: async({values,query}:{values:{content: string, fileUrl?: string}, query:Record<string,string>})=>{
        const token=await getToken()
        const chatInput = await axios.post(`http://localhost:3000/api/v1/messages?serverId=${query.serverId}&channelId=${query.channelId}`,
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