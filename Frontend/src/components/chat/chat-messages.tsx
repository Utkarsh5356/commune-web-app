import { type Members } from "@/hooks/server/use-server-data";

interface ChatMessagesProps {
   name: string;
   member: Members;
   chatId: string;
   socketQuery: Record<string,string>
   paramKey: "channelId" | "conversationId";
   paramValue: string;
   type: "channel" | "conversation" 
}

export const ChatMessages=({
  name,
  member,
  chatId,
  socketQuery,
  paramKey,
  paramValue,
  type  
}:ChatMessagesProps)=>{
  return (
    <div>
      ChatMessages  
    </div>
  )  
}