import { useAuth } from "@clerk/clerk-react"
import { useQuery } from "@tanstack/react-query";
import { MemberRole } from "../server/use-server-data";
import axios from "axios"

export interface MemberData {
  id: string;
  role: MemberRole;
  profileId: string;
  serverId: string    
}

export const useCurrentMemberData=({serverId}:{serverId:string | undefined})=>{
  const {getToken}=useAuth()
  return useQuery({
    queryKey: ["userMemberData" , serverId],
    enabled: !!serverId,
    queryFn: async()=>{
      const token=await getToken()
      const memberData=await axios.get<MemberData>(`http://localhost:3000/api/v1/member/current?serverId=${serverId}`,{
        headers:{
          'Authorization':`Bearer ${token}`,
          'Content-Type':'application/json'
        }
      })
      return memberData.data
    }
  })
}