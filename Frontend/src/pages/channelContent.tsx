import { useOutletContext } from "react-router-dom"
import { useChannelData } from "@/hooks/channel/use-channel-data"
import { useCurrentMemberData } from "@/hooks/member/use-current-member-data" 
import { ChatHeader } from "@/components/chat/chat-header"
import { ChatInput } from "@/components/chat/chat-input"
import { ChatMessages } from "@/components/chat/chat-messages"
import Loader from "@/components/ui/loader"

export const ChannelContent=()=>{
  const {serverId,channelId}=useOutletContext<{serverId: string, channelId: string}>()
  const { data: currentMember, isLoading: currentMemberLoading }=useCurrentMemberData({serverId})
  const { data: channelData,isLoading: channelDataLoading }=useChannelData({channelId})
  
  if(channelDataLoading || currentMemberLoading) return <Loader/>
  
  return(
    <div className="h-full">
      <div className="bg-[#313338] flex flex-col h-full">
        <ChatHeader 
         name={channelData?.name}
         serverId={channelData?.serverId}
         type="channel"
        />
        <div className="flex-1 overflow-y-auto">
         <ChatMessages
          member={currentMember}
          name={channelData?.name}
          chatId={channelId}
          type="channel"
          channelId={channelId}
          serverId={serverId}
          paramKey="channelId"
          paramValue={channelId}
         />
        </div>
        <ChatInput
          name={channelData?.name}
          type="channel"
          channelId= {channelId}
          serverId= {serverId}
        />
     </div>
    </div>
    
  ) 
}