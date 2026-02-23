import { ChannelType, type Channels, type MemberRole, type ServerData } from "@/hooks/use-server-data";
import { useParams,useNavigate } from "react-router-dom"
import { Hash,Mic,Video } from "lucide-react";

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
  
  const {}=useParams()
  const navigate=useNavigate()
  
  const Icon = iconMap[channel.type]

  return(
    <button
     onClick={() => {}}
     className={cn(
      "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/50 transition mb-1"
     )}
    >
     <Icon className="shrink-0 w-5 h-5 text-zinc-400"/>
     <p className={cn(
        "line-clamp-1 font-semibold text-sm text-zinc-400 group-hover:text-zinc-200 transition"
     )}>
      {channel.name}
     </p>
    </button>
  )  
}