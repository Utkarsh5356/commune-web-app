import { useQueryClient,useMutation } from "@tanstack/react-query"
import { useAuth } from "@clerk/clerk-react"
import axios from "axios"

export const useMemberDelete=()=>{
  const {getToken}=useAuth() 
  const queryClient=useQueryClient()
  
 return  useMutation({
      mutationFn: async({memberId,serverId}:{memberId: string,serverId: string | undefined})=>{
        const token=await getToken()
        const memberDelete = await axios.delete(`http://localhost:3000/api/v1/member/delete?serverId=${serverId}`,{
        headers:{
         'Authorization':`Bearer ${token}`,
         'memberId':memberId,
         'Content-Type':'application/json'
        }
      })
        return memberDelete.data
      },
      onSuccess: (_,{serverId})=>{
        queryClient.invalidateQueries({queryKey: ["userServerData" , serverId]})
      } 
    })
}