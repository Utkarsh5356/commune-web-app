import { useEffect,useState } from "react"
import Loader from "@/components/ui/loader"
import { useCurrentMemberData } from "@/hooks/member/use-current-member-data" 
import { getOrCreateConversation } from "@/hooks/use-conversation"
import { MemberRole } from "@/hooks/server/use-server-data"
import { useOutletContext } from "react-router"
import { ChatHeader } from "@/components/chat/chat-header"

interface MemberOneandTwoProps {
  id: string;
  profile: {
    id: string;
    name: string;
    imageUrl: string;
    email: string;
  };
  profileId: string;
  role: MemberRole;
  serverId: string;
}

interface CurrentConversationProps {
  id: string;
  memberOne: MemberOneandTwoProps;
  memberOneId: string;
  memberTwo: MemberOneandTwoProps
  memberTwoId: string
}

export const MemberContent=()=>{
  const {serverId,memberId}=useOutletContext<{serverId:string,memberId:string}>()
  const { data: currentMember, isLoading: currentMemberLoading }=useCurrentMemberData({serverId})
  const {getOrCreate} = getOrCreateConversation(currentMember?.id,memberId)
  const [currentConversation,setCurrentConversation]=useState<CurrentConversationProps>()
  const [isLoading,setIsLoading]=useState(true)

  useEffect(()=>{
   if(!currentMember?.id) return 

   const init = async()=>{
    try{
      setIsLoading(true)

      const result = await getOrCreate()
      setCurrentConversation(result)
    }catch(err){
      throw err
    }finally {
      setIsLoading(false)
    }
    
   }
    init()
  },[currentMember?.id,memberId])

  if(currentMemberLoading || isLoading) return <Loader/>
  
  return (
    <div className="bg-[#313338] flex flex-col h-full">
      <ChatHeader 
       imageUrl={currentConversation?.memberTwo.profile.imageUrl}
       name={currentConversation?.memberTwo.profile.name}
       serverId={serverId}
       type="conversation"
      />
    </div>
  )  
}