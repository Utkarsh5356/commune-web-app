import { useAuth } from "@clerk/clerk-react"
import { useQuery } from "@tanstack/react-query";
import { MemberRole } from "./use-server-data";
import axios from "axios"

interface MemberData {
  id: string;
  role: MemberRole;
  profileId: string;
  serverId: string    
}

export const useMemberData=({serverId,memberId}:{serverId:string | undefined,memberId:string | undefined})=>{
  const {getToken}=useAuth()
  return useQuery({
    queryKey: ["userMemberData" , memberId],
    enabled: !!serverId,
    placeholderData: (prev) => prev,
    queryFn: async()=>{
      const token=await getToken()
      const memberData=await axios.get<MemberData>(`http://localhost:3000/api/v1/member/data?serverId=${serverId}`,{
        headers:{
          'Authorization':`Bearer ${token}`,
          'Content-Type':'application/json'
        }
      })
      return memberData.data
    }
  })
}