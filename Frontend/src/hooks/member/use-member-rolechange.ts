import { useQueryClient,useMutation } from "@tanstack/react-query"
import { useAuth } from "@clerk/clerk-react"
import axios from "axios"

export const useMemberRoleChange=()=>{
  const {getToken}=useAuth() 
  const queryClient=useQueryClient()
  
 return  useMutation({
      mutationFn: async({role,memberId,serverId}:{role: string,memberId: string,serverId: string | undefined})=>{
        const token=await getToken()
        const roleChange = await axios.patch(`http://localhost:3000/api/v1/member/role-change?serverId=${serverId}`,
          {role},{
         headers:{
           'Authorization':`Bearer ${token}`,
           'memberId':memberId,
           'Content-Type':'application/json'
         }
        }
       )
        return roleChange.data
      },
      onSuccess: (_,{serverId})=>{
        queryClient.invalidateQueries({queryKey: ["userServerData" , serverId]})
      } 
    })
}