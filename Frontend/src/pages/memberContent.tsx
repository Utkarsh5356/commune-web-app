import { useEffect,useState } from "react"
import Loader from "@/components/ui/loader"
import { useCurrentMemberData } from "@/hooks/member/use-current-member-data" 
import { getOrCreateConversation } from "@/hooks/use-conversation"
import { MemberRole } from "@/hooks/server/use-server-data"
import { useOutletContext } from "react-router"
import { ChatHeader } from "@/components/chat/chat-header"
import { ChatMessages } from "@/components/chat/chat-messages"
import { ChatInput } from "@/components/chat/chat-input"

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

  if(!currentConversation || currentMemberLoading || isLoading) return <Loader/>
  
  return (
    <div className="h-full">
      <div className="bg-[#313338] flex flex-col h-full">
        <ChatHeader 
         imageUrl={currentConversation.memberTwo.profile.imageUrl}
         name={currentConversation.memberTwo.profile.name}
         serverId={serverId}
         type="conversation"
        />
        <div className="flex-1 overflow-y-auto">
         <ChatMessages
          member={currentMember}
          name={currentConversation.memberTwo.profile.name}
          chatId={currentConversation.id}
          type="conversation"
          query={{conversationId: currentConversation.id}}
          paramKey="conversationId"
          paramValue={currentConversation.id}
         />
        </div>
        <ChatInput
          name={currentConversation.memberTwo.profile.name}
          type="conversation"
          query={{conversationId: currentConversation.id}}
        />
      </div>
    </div>
  )  
}