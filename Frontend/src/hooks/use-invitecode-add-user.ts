import { useQueryClient,useMutation } from "@tanstack/react-query"
import { useAuth } from "@clerk/clerk-react"
import axios from "axios"

export const useInviteCodeUser=()=>{
  const {getToken}=useAuth() 
  const queryClient=useQueryClient()

  return  useMutation({
      mutationFn: async({inviteCode}:{inviteCode:string | undefined})=>{
        const token=await getToken()
        const inviteCodeUserData = await axios.put("http://localhost:3000/api/v1/server/invitecode-add-user",{
          inviteCode
        },{
        headers:{
         'Authorization':`Bearer ${token}`,
         'Content-Type':'application/json'
        }
       })
        return inviteCodeUserData.data
      }
    })
}