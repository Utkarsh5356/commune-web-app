import { useAuth } from "@clerk/clerk-react"
import { useQuery } from "@tanstack/react-query";
import { ChannelType } from "./use-server-data";
import axios from "axios"


export interface Servers {
  id: string;
  name: string;
  imageUrl: string;
  inviteCode:string
  channels: {
    id: string;
    name: string;
    type: ChannelType;
  }[]  
}

export const useAllServers=()=>{
  const { getToken }=useAuth()
  
  return useQuery({
    queryKey: ["allServers"],
    queryFn: async()=>{
      const token=await getToken()
      const servers=await axios.get<Servers[]>(`http://localhost:3000/api/v1/server/all`,{
        headers:{
          'Authorization':`Bearer ${token}`,
          'Content-Type':'application/json'
        }
      })
      return servers.data
    }
  }) 
}