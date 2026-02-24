import { useQueryClient,useMutation } from "@tanstack/react-query"
import { useAuth } from "@clerk/clerk-react"
import axios from "axios"

export const useChannelCreate=()=>{
  const {getToken}=useAuth() 
  const queryClient=useQueryClient()

  return  useMutation({
      mutationFn: async({values,serverId}:{values:{name:string, type:string},serverId: string | undefined})=>{
        const token=await getToken()
        const channelCreate = await axios.post(`http://localhost:3000/api/v1/channel/create?serverId=${serverId}`,{
           values
        },{
          headers:{
           'Authorization':`Bearer ${token}`,
           'Content-Type':'application/json'
          }
        })
        return channelCreate.data
      },
      onSuccess: (_,{serverId})=>{
        queryClient.invalidateQueries({queryKey: ["userServerData" , serverId]})
      } 
    })
}