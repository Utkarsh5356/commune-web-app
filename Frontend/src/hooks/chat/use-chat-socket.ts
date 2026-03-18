import { type Message } from "@/components/chat/chat-messages"
import { type MemberData } from "../member/use-current-member-data"
import { type Profile } from "../profile/use-currentProfile"
import { useEffect } from "react"
import { useSocket } from "@/components/provider/socket-provider"
import { useQueryClient } from "@tanstack/react-query"

type MessageWithMemberWithProps = Message & {
  member: MemberData & {
    profile: Profile
  } 
}

type ChatSocketProps = {
 addKey: string;
 updateKey: string;
 queryKey: string;
}

export const useChatSocket=({
  addKey,
  updateKey,
  queryKey  
}: ChatSocketProps)=>{
  const { socket } = useSocket()
  const queryClient = useQueryClient()

  useEffect(()=>{
   if(!socket) return   
   
   socket.on(updateKey, (message: MessageWithMemberWithProps) => {
     queryClient.setQueryData([queryKey], (oldData:any) => {
      if(!oldData || !oldData.pages || oldData.pages.length === 0) return
      
      const newData = oldData.pages.map((page: any) => {
        return {
          ...page,
          items: page.items.map((item: MessageWithMemberWithProps) => {
            if(item.id === message.id) return message
            return item
          })  
        }
      });

      return {
        ...oldData,
        pages: newData
      }
     })
   });

   socket.on(addKey, (message: MessageWithMemberWithProps) => {
     queryClient.setQueryData([queryKey], (oldData:any) => {
        if(!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [{
             items: [message]
            }]
          }  
        } 

        const newData = [...oldData.pages]

        newData[0] = {
            ...newData[0],
            items: [
              message,
              ...newData[0].items  
            ]
        }

        return {
          ...oldData,
          pages: newData
        }
     })
   });

   return () => {
     socket.off(addKey)
     socket.off(updateKey)
   }
  },[queryClient, addKey, queryKey, socket, updateKey])
}