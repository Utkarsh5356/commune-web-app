import { useOutletContext } from "react-router-dom"

export const ChannelContent=()=>{
  const {channelId,memberId}=useOutletContext<{channelId: string,memberId: string}>()

  return(
    <div>
      ChannelContent
    </div>
  ) 
}