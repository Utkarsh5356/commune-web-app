import { Hash } from "lucide-react"
import { UserAvatar } from "../user-avatar";
import { SocketIndicator } from "../socket-indicator";
import { ChatVideoButton } from "./chat-video-button";
import { AiSummaryPanel } from "../ai/ai-summary-pannel";

interface ChatHeaderProps {
  name?: string;
  type: "channel" | "conversation";
  imageUrl?: string;
  serverId: string
  channelId: string
}

export const ChatHeader=({
  name,
  type,
  imageUrl,
  channelId,
  serverId  
}: ChatHeaderProps)=>{
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12
    border-neutral-800 border-b-2">
       {type === "channel" && (
        <Hash className="w-5 h-5 text-zinc-400 mr-2"/>
       )}
       {type === "conversation" && (
        <UserAvatar
         src={imageUrl}
         className="h-8 w-8 md:h-8 md:w-8 mr-2"
        />
       )}
       <p className="font-mono font-semibold text-md text-white">
        {name}
       </p>
       <div className="ml-auto flex items-center gap-2">
         {type === "channel" && serverId && channelId && (
           <AiSummaryPanel serverId={serverId} channelId={channelId} channelName={name} />
         )}
 
         {type === "conversation" && (
          <ChatVideoButton/>
         )}
         <SocketIndicator/>
       </div>
    </div>
  ) 
}