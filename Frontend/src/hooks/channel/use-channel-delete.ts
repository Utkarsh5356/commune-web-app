import { useQueryClient,useMutation } from "@tanstack/react-query"
import { useAuth } from "@clerk/clerk-react"
import axios from "axios"

export const useChannelDelete=()=>{
  const {getToken}=useAuth() 
  const queryClient=useQueryClient()
  
 return  useMutation({
      mutationFn: async({channelId,serverId}:{channelId: string | undefined,serverId: string | undefined})=>{
        const token=await getToken()
        const channelDelete = await axios.delete(`http://localhost:3000/api/v1/channel/delete?channelId=${channelId}&serverId=${serverId}`,{
          headers:{
         'Authorization':`Bearer ${token}`,
         'Content-Type':'application/json'
        }
       })
        return channelDelete.data
      },
      onSuccess: (_,{serverId})=>{
        queryClient.invalidateQueries({queryKey: ["userServerData" , serverId]})
      } 
    })
}