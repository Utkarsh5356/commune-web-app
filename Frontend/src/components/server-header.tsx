import { useState } from "react";
import { type Members } from "@/hooks/use-server-data"
import { useModal } from "store/use-modal-store";
import { 
 ChevronDown,
 UserPlus,
 Settings,
 Users,
 PlusCircle,
 Trash,
 LogOut 
} from "lucide-react";
import { 
 DropdownMenu,
 DropdownMenuTrigger,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuSeparator
} from "./ui/dropdown-menu";

export interface ServerProps {
  id:string;
  name:string;
  imageUrl:string;
  inviteCode:string;
  profileId:string;
  members:Members[]
}
interface ServerHeaderProps {
  serverHeaderData: ServerProps | undefined
  role: string | undefined
}

export const ServerHeader=({serverHeaderData,role}:ServerHeaderProps)=>{
  const [server,setServer]=useState(serverHeaderData)
  const { onOpen } = useModal()
  const isAdmin = role === "ADMIN"
  const isModerator = isAdmin || role === "MODERATOR"
  return(
    <DropdownMenu>
      <DropdownMenuTrigger
       className="focus:outline-none"
      >
        <button
         className="w-full text-md font-semibold px-3 cursor-pointer flex items-center
          h-12 border-neutral-600 border-b-2 hover:bg-zinc-700/50 transition"
        >
          {server?.name}
          <ChevronDown className="h-5 w-5 ml-auto"/>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
       className="w-56 text-xs bg-neutral-800 border-0 font-medium space-y-0.5"
      >
       {isModerator && (
         <DropdownMenuItem 
          onClick={()=>onOpen("invite", { server })}
          className="text-indigo-500 h-full w-full px-3 py-2 text-sm cursor-pointer
          hover:bg-neutral-700 hover:text-indigo-400
          focus:bg-neutral-700 focus:text-indigo-400
          active:bg-neutral-700 active:text-indigo-400
          data-highlighted:bg-neutral-700
          data-highlighted:text-indigo-400"
         >
            Invite People
            <UserPlus className="text-indigo-400 h-4 w-4 ml-auto"/>
         </DropdownMenuItem>
       )}
       {isAdmin && (
         <DropdownMenuItem 
          onClick={()=>onOpen("editServer" , {server})}
          className="text-white h-full w-full px-3 py-2 text-sm cursor-pointer
          hover:bg-neutral-700 hover:text-neutral-300
          focus:bg-neutral-700 focus:text-neutral-300
          active:bg-neutral-700 active:text-neutral-300
          data-highlighted:bg-neutral-700
          data-highlighted:text-neutral-200"
         >
            Server Settings
            <Settings className="h-4 w-4 ml-auto"/>
         </DropdownMenuItem>
       )}
       {isAdmin && (
         <DropdownMenuItem 
          onClick={()=>onOpen("members" , {server,setServer})}
          className="text-white h-full w-full px-3 py-2 text-sm cursor-pointer
          hover:bg-neutral-700 hover:text-neutral-300
          focus:bg-neutral-700 focus:text-neutral-300
          active:bg-neutral-700 active:text-neutral-300
          data-highlighted:bg-neutral-700
          data-highlighted:text-neutral-200"
         >
            Manage Members
            <Users className="h-4 w-4 ml-auto"/>
         </DropdownMenuItem>
       )}
       {isModerator && (
         <DropdownMenuItem 
          onClick={()=>onOpen("createChannel" , {server})}
          className="text-white h-full w-full px-3 py-2 text-sm cursor-pointer
          hover:bg-neutral-700 hover:text-neutral-300
          focus:bg-neutral-700 focus:text-neutral-300
          active:bg-neutral-700 active:text-neutral-300
          data-highlighted:bg-neutral-700
          data-highlighted:text-neutral-200"
         >
            Create Channel
            <PlusCircle className="h-4 w-4 ml-auto"/>
         </DropdownMenuItem>
       )}
       {isAdmin && (
         <DropdownMenuSeparator className="bg-neutral-500"/>
       )}
            {isModerator && (
         <DropdownMenuItem 
          onClick={()=>onOpen("deleteServer" , {server})}
          className="text-rose-500 h-full w-full px-3 py-2 text-sm cursor-pointer
          hover:bg-neutral-700 hover:text-rose-500
          focus:bg-neutral-700 focus:text-rose-500
          active:bg-neutral-700 active:text-rose-500
          data-highlighted:bg-neutral-700
          data-highlighted:text-rose-500"
         >
            Delete Server
            <Trash className="text-rose-500 h-4 w-4 ml-auto"/>
         </DropdownMenuItem>
       )}
        {!isAdmin && (
         <DropdownMenuItem
          onClick={()=>onOpen("leaveServer" , {server})} 
          className="text-rose-500 h-full w-full px-3 py-2 text-sm cursor-pointer
          hover:bg-neutral-700 hover:text-rose-500
          focus:bg-neutral-700 focus:text-rose-500
          active:bg-neutral-700 active:text-rose-500
          data-highlighted:bg-neutral-700
          data-highlighted:text-rose-500"
         >
            Leave Server
            <LogOut className="text-rose-500 h-4 w-4 ml-auto"/>
         </DropdownMenuItem>
       )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}