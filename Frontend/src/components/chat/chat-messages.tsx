import { Fragment } from "react";
import { format } from "date-fns"
import { type MemberData } from "@/hooks/member/use-current-member-data"; 
import { type Profile } from "@/hooks/profile/use-currentProfile";
import { ChatWelcome } from "./chat-welcome";
import { ChatItem } from "./chat-item";
import { useChatQuery } from "@/hooks/chat/use-chat-query";
import { Loader2,ServerCrash } from "lucide-react";

interface Message {
  id: string;
  content: string;
  fileUrl: string | null;
  memberId: string;
  channelId: string;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type MessageWithMemberWithProfile = Message & {
  member: MemberData & {
    profile: Profile
  }
}

interface ChatMessagesProps {
   name?: string;
   member?: MemberData;
   chatId: string;
   channelId: string;
   serverId: string;
   paramKey: "channelId" | "conversationId";
   paramValue: string;
   type: "channel" | "conversation" 
}

const DATE_FORMAT = "d MMM yyyy, HH:mm"

export const ChatMessages=({
  name,
  member,
  chatId,
  channelId,
  serverId,
  paramKey,
  paramValue,
  type  
}:ChatMessagesProps)=>{
  const queryKey = `chat:${chatId}`
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useChatQuery({
    queryKey,
    paramKey,
    paramValue
  })
  
  if(status === "pending"){
    return (
      <div className="flex flex-col flex-1 justify-center items-center h-full w-full">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4"/>
        <p className="text-xs text-zinc-400 font-mono">
         Loading messages...
        </p>
      </div>
    )
  }

  if(status === "error"){
    return (
      <div className="flex flex-col flex-1 justify-center items-center h-full w-full">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4"/>
        <p className="text-xs text-zinc-400 font-mono">
         Something went wrong!
        </p>
      </div>
    )
  }


  return (
    <div className="flex-1 flex flex-col h-full py-4 overflow-y-auto">
      <div className="flex-1"/>
      <ChatWelcome
       type={type}
       name={name}
      />
      <div className="flex flex-col-reverse mt-auto">
       {data?.pages?.map((group,i) => (
        <Fragment key={i}>
         {group.items.map((message: MessageWithMemberWithProfile) => (
          <ChatItem
           key={message.id}
           id={message.id}
           content={message.content}
           member={message.member}
           currentMember={member}
           fileUrl={message.fileUrl}
           deleted={message.deleted}
           timeStamp={format(new Date(message.createdAt), DATE_FORMAT)}
           isUpdated={message.updatedAt !== message.createdAt}
           channelId={channelId}
           serverId={serverId}
          />
         ))}
        </Fragment>
       ))}
      </div>
    </div>
  )  
}