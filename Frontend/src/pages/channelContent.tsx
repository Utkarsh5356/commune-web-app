import { useOutletContext } from "react-router-dom"
import { useChannelData } from "@/hooks/use-channel-data"
import { useMemberData } from "@/hooks/use-member-data" 
import { ChatHeader } from "@/components/chat-header"
import Loader from "@/components/ui/loader"

export const ChannelContent=()=>{
  const {channelId,serverId,memberId}=useOutletContext<{channelId: string,serverId: string,memberId: string}>()
  const { data: channelData,isLoading: channelDataLoading }=useChannelData({channelId})
  const { data: memberData,isLoading: memberDataLoading }=useMemberData({serverId,memberId})
  
  if(channelDataLoading || memberDataLoading) return <Loader/>
  
  return(
    <div className="bg-[#313338] flex flex-col h-full">
      <ChatHeader 
       name={channelData?.name}
       serverId={channelData?.serverId}
       type="channel"
      />
    </div>
  ) 
}