import { useQueryClient,useMutation } from "@tanstack/react-query"
import { useAuth } from "@clerk/clerk-react"
import axios from "axios"

export const useServerDelete=()=>{
  const {getToken}=useAuth() 
  const queryClient=useQueryClient()
  
 return  useMutation({
      mutationFn: async({serverId}:{serverId: string | undefined})=>{
        const token=await getToken()
        const serverDelete = await axios.delete(`http://localhost:3000/api/v1/server/delete?serverId=${serverId}`,{
          headers:{
         'Authorization':`Bearer ${token}`,
         'Content-Type':'application/json'
        }
       })
        return serverDelete.data
      },
      onSuccess: ()=>{
        queryClient.invalidateQueries({queryKey: ["allServers"]})
      } 
    })
}