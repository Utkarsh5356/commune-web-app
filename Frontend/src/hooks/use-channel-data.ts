import { useAuth } from "@clerk/clerk-react"
import { useQuery } from "@tanstack/react-query";
import { ChannelType } from "./use-server-data"; 
import axios from "axios"

interface ChannelData{
 id: string;
 name: string;
 type: ChannelType;
 profileId: string;
 serverId: string
}

export const useChannelData=({channelId}:{channelId:string | undefined})=>{
  const {getToken}=useAuth()
  return useQuery({
    queryKey: ["userChannelData" , channelId],
    enabled: !!channelId,
    placeholderData: (prev) => prev,
    queryFn: async()=>{
      const token=await getToken()
      const channelData=await axios.get<ChannelData>(`http://localhost:3000/api/v1/channel/data?channelId=${channelId}`,{
        headers:{
          'Authorization':`Bearer ${token}`,
          'Content-Type':'application/json'
        }
      })
      return channelData.data
    }
  })
}