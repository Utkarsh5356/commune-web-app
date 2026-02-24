import { ChannelType, MemberRole, type Channels, type ServerData } from "@/hooks/use-server-data";
import { useParams,useNavigate } from "react-router-dom"
import { Hash,Mic,Video,Edit,Trash,Lock } from "lucide-react";
import { ActionTooltip } from "./action-tooltip";
import { cn } from "@/lib/utils";

interface ServerChannelProps {
   channel: Channels;
   server?: ServerData;
   role?: MemberRole
}

const iconMap = {
   [ChannelType.TEXT] : Hash, 
   [ChannelType.AUDIO] : Mic,
   [ChannelType.VIDEO] : Video 

}

export const ServerChannel=({
  channel,
  server,
  role  
}: ServerChannelProps)=>{
  
  const {channelId}=useParams()
  const navigate=useNavigate()
  
  const Icon = iconMap[channel.type]

  return(
    <button
     onClick={() => {}}
     className={cn(
      "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/50 transition mb-1",
      channelId === channel.id && "bg-zinc-700"
    )}
    >
     <Icon className="shrink-0 w-5 h-5 text-zinc-400"/>
     <p className={cn(
        "line-clamp-1 font-semibold text-sm text-zinc-400 group-hover:text-zinc-200 transition",
        channelId === channel.id && "text-zinc-200 group-hover:text-white"
     )}>
      {channel.name}
     </p>
     {channel.name !== "general" && role !== MemberRole.GUEST && (
      <div className="ml-auto flex items-center gap-x-2">
         <ActionTooltip label="Edit">
            <Edit
              className="hidden group-hover:block w-4 h-4 text-zinc-400
              hover:text-zinc-300 transition"
            />
         </ActionTooltip>
         <ActionTooltip label="Delete">
            <Trash
              className="hidden group-hover:block w-4 h-4 text-zinc-400
              hover:text-zinc-300 transition"
            />
         </ActionTooltip>
      </div>
     )}
     {channel.name === "general" && (
      <Lock 
        className="ml-auto w-4 h-4 text-zinc-400"
      />
     )}
    </button>
  )  
}