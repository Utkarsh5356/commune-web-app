import { useQueryClient,useMutation } from "@tanstack/react-query"
import { useAuth } from "@clerk/clerk-react"
import axios from "axios"

export const useServerLeave=()=>{
  const {getToken}=useAuth() 
  const queryClient=useQueryClient()
  
 return  useMutation({
      mutationFn: async({serverId}:{serverId: string | undefined})=>{
        const token=await getToken()
        const serverLeave = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/server/leave?serverId=${serverId}`,{undefined},{
        headers:{
         "Authorization":`Bearer ${token}`,
         'Content-Type':'application/json'
        }
       })
        return serverLeave.data
      },
      onSuccess: ()=>{
        queryClient.invalidateQueries({queryKey: ["allServers"]})
      } 
    })
}