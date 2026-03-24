import { useMutation } from "@tanstack/react-query"
import { useAuth } from "@clerk/clerk-react"
import axios from "axios"

export const useDirectMessageInput=()=>{
  const {getToken}=useAuth() 
  
 return  useMutation({
      mutationFn: async({values,query}:{values:{content: string, fileUrl?: string}, query:Record<string,string>})=>{
        const token=await getToken()
        const directMessageInput = await axios.post(`http://localhost:3000/api/v1/direct-messages?conversationId=${query.conversationId}`,
        {
         values
        },{    
         headers:{
          'Authorization':`Bearer ${token}`,
          'Content-Type':'application/json'
         }
        })
        return directMessageInput.data
      },
    })
}