import { useMutation } from "@tanstack/react-query"
import { useAuth } from "@clerk/clerk-react"
import axios from "axios"

export const useInviteCodeUser=()=>{
  const {getToken}=useAuth() 

  return  useMutation({
      mutationFn: async({inviteCode}:{inviteCode:string | undefined})=>{
        const token=await getToken()
        const inviteCodeUserData = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/v1/server/invitecode-add-user`,{
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