import { type Members} from "@/hooks/use-server-data"
import { type ServerProps } from "./server-header";
import { useParams,useNavigate } from "react-router-dom";
import { MemberRole } from "@/hooks/use-server-data";
import { ShieldCheck } from "lucide-react";
import { UserAvatar } from "./user-avatar";
import { cn } from "@/lib/utils"; 

interface ServerMemberProps {
  member: Members;
  server?: ServerProps
}

const roleIconMap = {
  [MemberRole.GUEST] : null,
  [MemberRole.MODERATOR] : <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500"/>,
  [MemberRole.ADMIN] : <ShieldCheck className="h-4 w-4 ml-2 text-rose-500"/>
}

export const ServerMember=({
  member,
  server
}: ServerMemberProps)=>{
  
  const {memberId,channelId}=useParams()
  const navigate=useNavigate()
  
  const icon = roleIconMap[member.role]

  return (
    <button
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/50 transition mb-1 cursor-pointer",
        memberId === member.id && "bg-zinc-700"
      )}
    >
     <UserAvatar 
       src={member.profile.imageUrl}
       className="h-8 w-8 md:h-8 md:w-8"
     />
     <p 
      className={cn(
        "font-semibold text-sm text-zinc-400 group-hover:text-zinc-200 transition",
        channelId === member.id && "text-zinc-200 group-hover:text-white"
      )}
     >
      {member.profile.name}
     </p>
     {icon}
    </button>
  )  
}