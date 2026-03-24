import { useMutation } from "@tanstack/react-query"
import { useAuth } from "@clerk/clerk-react"
import axios from "axios"

export const useDirectMessageDelete=()=>{
  const {getToken}=useAuth() 
  
 return  useMutation({
      mutationFn: async({id,query}:{id: string | undefined, query: Record<string,string> | undefined})=>{
        const token=await getToken()
        const directMessageDelete = await axios.delete(`http://localhost:3000/api/v1/direct-messages?directMessageId=${id}&conversationId=${query?.conversationId}`,
        {    
         headers:{
          'Authorization':`Bearer ${token}`,
          'Content-Type':'application/json'
         }
        })
        return directMessageDelete.data
      },
    })
}