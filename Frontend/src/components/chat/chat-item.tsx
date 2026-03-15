import type { MemberData } from "@/hooks/member/use-current-member-data";
import type { Profile } from "@/hooks/profile/use-currentProfile";
import { UserAvatar } from "../user-avatar";
import { Image } from "@unpic/react";
import { ActionTooltip } from "../action-tooltip";
import { ShieldCheck } from "lucide-react";
import { MemberRole } from "@/hooks/server/use-server-data";

interface ChatItemProps {
  id: string;
  content: string;
  member: MemberData & {
    profile: Profile
  };
  timeStamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember?: MemberData;
  isUpdated: boolean;
  serverId: string;
  channelId: string
}

const roleIconMap = {
   "GUEST" : null,
   "MODERATOR" : <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500"/>,
   "ADMIN" : <ShieldCheck className="h-4 w-4 ml-2 text-rose-500"/>  
}

export const ChatItem = ({
  id,
  content,
  member,
  timeStamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated  
}: ChatItemProps) => {
  const fileType = fileUrl?.split(".").pop()

  const isAdmin = currentMember?.role === MemberRole.ADMIN  
  const isModerator = currentMember?.role === MemberRole.MODERATOR
  const isOwner = currentMember?.id === member.id  
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner)
  const canEditMessage = !deleted && isOwner && !fileUrl
  const isPDF = fileType === "pdf" && fileUrl
  const isImage = !isPDF && fileUrl

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4
    transition w-full">
     <div className="group flex gap-x-2 items-start w-full">
      <div className="cursor-pointer hover:drop-shadow-md transition"> 
       <UserAvatar src={member.profile.imageUrl}/>  
      </div>
      <div className="flex flex-col pt-2 w-full">
       <div className="flex items-center gap-x-2">
        <div className="flex items-center">
         <p className="font-semibold font-mono text-md hover:underline cursor-pointer">
          {member.profile.name}
         </p>
         <ActionTooltip label={member.role}>
           {roleIconMap[member.role]}
         </ActionTooltip>
        </div>
        <span className="text-xs text-zinc-400">
          {timeStamp}  
        </span>
       </div>
       {isImage && (
        <a 
         href={fileUrl}
         target="blank"
         rel="noopener noreferrer"
         className="relative aspect-spare rounded-md mt-2 overflow-hidden border-none flex
         items-center bg-[#0c0d0d] h-48 w-48"
        >  
         <Image
          src={fileUrl}
          alt={content}
         width={800}
         height={900}
         layout="constrained"
          className="object-cover"
         />
        </a>
       )}
      </div>
     </div>
    </div>
  )  
}