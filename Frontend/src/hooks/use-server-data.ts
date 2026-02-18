import { useAuth } from "@clerk/clerk-react"
import { useQuery } from "@tanstack/react-query";
import axios from "axios"

export enum ChannelType{
  TEXT= "TEXT",
  AUDIO= "AUDIO",
  VIDEO= "VIDEO"
}
export enum MemberRole {
  GUEST="GUEST",
  MODERATOR="MODERATOR",
  ADMIN="ADMIN"
}
export interface Channels{
  id:string;
  name:string;
  type: ChannelType;
}
export interface Members{
  id:string;
  role:MemberRole;
  profileId:string;
  profile:{
    id:string;
    userId:string;
    name:string;
    imageUrl:string;
    email:string
  }
}
export interface ServerDataTypes{
  id:string;
  name:string;
  imageUrl:string;
  inviteCode:string;
  profileId:string;
  channels:Channels[];
  members:Members[]
}
export interface ServerData{
  serverData:ServerDataTypes 
  ChannelType:ChannelType  
}

export const useServerData=({serverId}:{serverId:string | undefined})=>{
  const {getToken}=useAuth()
  
  return useQuery({
    queryKey: ["userServerData" , serverId],
    enabled: !!serverId,
    queryFn: async()=>{
      const token=await getToken()
      const serverData=await axios.get<ServerData>(`http://localhost:3000/api/v1/server/data?serverId=${serverId}`,{
        headers:{
          'Authorization':`Bearer ${token}`,
          'Content-Type':'application/json'
        }
      })
      return serverData.data
    }
  })
}