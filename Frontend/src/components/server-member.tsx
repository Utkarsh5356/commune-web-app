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

export const ServerMember = ({
  member,
  server
}: ServerMemberProps) => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const icon = roleIconMap[member.role];
  
  const onClick=()=>{
    navigate(`member/${member.id}`)
  }

  const Ticker = () => {
    return (
      <>
        <style>{`
          @keyframes smoothTicker {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-50%, 0, 0); }
          }
          .ticker-wrapper {
            display: flex;
            width: fit-content;
            will-change: transform;
            animation: smoothTicker 10s linear infinite;
          }
          .group:hover .ticker-wrapper {
            animation-play-state: paused;
          }
        `}</style>
        
        <div className="w-30 overflow-hidden ml-2">
          <div className="ticker-wrapper">
            <span className={cn(
               "whitespace-nowrap font-semibold text-sm text-zinc-400 group-hover:text-zinc-200 pr-12",
                memberId === member.id && "text-zinc-200 group-hover:text-white",
            )}>
              {member.profile.name}
            </span>
            <span className={cn(
               "whitespace-nowrap font-semibold text-sm text-zinc-400 group-hover:text-zinc-200 pr-12",
                memberId === member.id && "text-zinc-200 group-hover:text-white",
            )}>
              {member.profile.name}
            </span>
          </div>
        </div>
      </>
    );
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center w-full hover:bg-zinc-700/50 transition mb-1 cursor-pointer",
        memberId === member.id && "bg-zinc-700"
      )}
    >
      <div className="shrink-0">
        <UserAvatar 
          src={member.profile.imageUrl}
          className="h-8 w-8" 
        />
      </div>
      
      <Ticker/>

      <div className="shrink-0 ml-auto">
        {icon}
      </div>
    </button>
  );
}