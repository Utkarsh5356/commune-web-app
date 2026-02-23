import { MemberRole, type ChannelType } from "@/hooks/use-server-data";
import { useModal } from "store/use-modal-store";
import type { ServerProps } from "./server-header";
import { ActionTooltip } from "./action-tooltip";
import { Plus,Settings } from "lucide-react";

interface ServerSectionProps {
    label: string;
    role?: MemberRole;
    sectionType: "channels" | "members";
    channelType?: ChannelType
    server?: ServerProps
}

export const ServerSection=({
  label,
  role,
  sectionType,
  channelType,
  server  
}: ServerSectionProps)=>{

  const { onOpen }=useModal() 
    
  return(
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-400">
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === "channels" && (
        <ActionTooltip label="Create Channel" side="top">
          <button
           onClick={()=>onOpen("createChannel")}
           className="text-zinc-400 hover:text-zinc-300 transition">
           <Plus className="h-4 w-4 cursor-pointer"/>
          </button>
        </ActionTooltip>
      )}
      {role === MemberRole.ADMIN && sectionType === "members" && (
        <ActionTooltip label="Create Channel" side="top">
          <button
           onClick={()=>onOpen("members" , {server})}
           className="text-zinc-400 hover:text-zinc-300 transition">
           <Settings className="h-4 w-4 cursor-pointer"/>
          </button>
        </ActionTooltip>
      )}
    </div>
  )
}