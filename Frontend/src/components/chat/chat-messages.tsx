import { useEffect, Fragment, useRef } from "react";
import { format } from "date-fns"
import { type MemberData } from "@/hooks/member/use-current-member-data"; 
import { type Profile } from "@/hooks/profile/use-currentProfile";
import { useChatSocket } from "@/hooks/chat/use-chat-socket";
import { ChatWelcome } from "./chat-welcome";
import { ChatItem } from "./chat-item";
import { useChatQuery } from "@/hooks/chat/use-chat-query";
import { Loader2,ServerCrash } from "lucide-react";

export interface Message {
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
   chatId?: string;
   apiUrl: string;
   query: Record<string, string>
   paramKey: "channelId" | "conversationId";
   paramValue?: string;
   type: "channel" | "conversation" 
}

const DATE_FORMAT = "d MMM yyyy, HH:mm"

export const ChatMessages=({
  name,
  member,
  chatId,
  query,
  paramKey,
  paramValue,
  apiUrl,
  type  
}:ChatMessagesProps)=>{
  const queryKey = `chat:${chatId}`
  const addKey = `chat:${chatId}:messages`
  const updateKey = `chat:${chatId}:messages:update`
  
  const chatRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useChatQuery({
    apiUrl,
    queryKey,
    paramKey,
    paramValue
  })
  
  useChatSocket({queryKey, addKey, updateKey})
   
  useEffect(() => {
   const topDiv = chatRef?.current
   if(!topDiv) return  
    
   const distnaceFromBottom = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight
   const isNearBottom = distnaceFromBottom <= 100
   
   if(isNearBottom) bottomRef.current?.scrollIntoView({behavior: "smooth"})
  },[data?.pages?.[0]?.items?.[0]])
  
  useEffect(()=>{
   const observer = new IntersectionObserver((entries) => {
    if(entries[0].isIntersecting && hasNextPage && !isFetchingNextPage){
      fetchNextPage()
    }
   })
   
   if(topRef.current) observer.observe(topRef.current)
    
   return () => observer.disconnect()   
  },[hasNextPage, isFetchingNextPage, fetchNextPage])

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
    <div ref={chatRef} className="flex-1 flex flex-col h-full py-4 chat-scroll overflow-y-auto">
      <div ref={topRef}/>
       
      {isFetchingNextPage && (
       <div className="flex justify-center">
         <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4"/>
       </div>
      )}

      {!hasNextPage && <div className="flex-1"/>}
      {!hasNextPage && (<ChatWelcome
       type={type}
       name={name}
      />)}
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
           type={type}
           query={query}
          />
         ))}
        </Fragment>
       ))}
      </div>
     <div ref={bottomRef}/>
    </div>
  )  
}