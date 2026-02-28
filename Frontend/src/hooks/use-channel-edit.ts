import { useQueryClient,useMutation } from "@tanstack/react-query"
import { useAuth } from "@clerk/clerk-react"
import axios from "axios"

export const useChannelEdit=()=>{
  const {getToken}=useAuth() 
  const queryClient=useQueryClient()

  return  useMutation({
      mutationFn: async({values,channelId,serverId}:{values:{name:string, type:string}, channelId: string | undefined, serverId: string | undefined})=>{
        const token=await getToken()
        const channelEdit = await axios.patch(`http://localhost:3000/api/v1/channel/edit?channelId=${channelId}&serverId=${serverId}`,{
           values
        },{
          headers:{
           'Authorization':`Bearer ${token}`,
           'Content-Type':'application/json'
          }
        })
        return channelEdit.data
      },
      onSuccess: (_,{serverId})=>{
        queryClient.invalidateQueries({queryKey: ["userServerData" , serverId]})
      } 
    })
}