import { ChannelType, MemberRole, type Channels } from "@/hooks/use-server-data";
import { type ServerProps } from "./server-header";
import { useParams,useNavigate } from "react-router-dom"
import { Hash,Mic,Video,Edit,Trash,Lock } from "lucide-react";
import { ActionTooltip } from "./action-tooltip";
import { cn } from "@/lib/utils";
import { useModal } from "store/use-modal-store";

interface ServerChannelProps {
   channel: Channels;
   server?: ServerProps;
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
  
  const { onOpen }=useModal()
  const {channelId}=useParams()
  const navigate=useNavigate()
  
  const Icon = iconMap[channel.type]

  return(
    <button
     onClick={() => {}}
     className={cn(
      "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/50 transition mb-1 cursor-pointer",
      channelId === channel.id && "bg-zinc-700"
    )}
    >
     <Icon className="shrink-0 w-5 h-5 text-zinc-400 group-hover:text-zinc-200 transition"/>
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
              hover:text-zinc-200 transition cursor-pointer"
            />
         </ActionTooltip>
         <ActionTooltip label="Delete">
            <Trash
              onClick={()=>onOpen("deleteChannel" , {server,channel})}
              className="hidden group-hover:block w-4 h-4 text-zinc-400
              hover:text-zinc-200 transition cursor-pointer"
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