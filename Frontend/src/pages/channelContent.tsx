import { useOutletContext } from "react-router-dom"
import { useChannelData } from "@/hooks/use-channel-data"
import { ChatHeader } from "@/components/chat-header"
import Loader from "@/components/ui/loader"

export const ChannelContent=()=>{
  const {channelId}=useOutletContext<{channelId: string}>()
  const { data: channelData,isLoading: channelDataLoading }=useChannelData({channelId})
  
  if(channelDataLoading) return <Loader/>
  
  return(
    <div>
      <div className="bg-[#313338] flex flex-col h-full">
        <ChatHeader 
         name={channelData?.name}
         serverId={channelData?.serverId}
         type="channel"
        />
       </div>
    </div>
    
  ) 
}