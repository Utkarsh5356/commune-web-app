import { useMutation } from "@tanstack/react-query"
import { useAuth } from "@clerk/clerk-react"
import axios from "axios"

export const useDirectMessageEdit=()=>{
  const {getToken}=useAuth() 
  
 return  useMutation({
      mutationFn: async({values,id,query}:{values:{content: string}, id: string,query: Record<string,string>})=>{
        const token=await getToken()
        const directMessageEdit = await axios.patch(`http://localhost:3000/api/v1/direct-messages?directMessageId=${id}&conversationId=${query.conversationId}`,
        {
         values
        },{    
         headers:{
          'Authorization':`Bearer ${token}`,
          'Content-Type':'application/json'
         }
        })
        return directMessageEdit.data
      },
    })
}