import { useInfiniteQuery } from "@tanstack/react-query";
import { useSocket } from "@/components/provider/socket-provider";
import { useAuth } from "@clerk/clerk-react"
import axios from "axios";

interface ChatQueryProps {
   queryKey: string;
   paramKey: "channelId" | "conversationId"; 
   paramValue: string;
}

export const useChatQuery=({
  queryKey,
  paramKey,
  paramValue  
}: ChatQueryProps) => {
  const {isConnected} = useSocket()
  const {getToken}=useAuth() 

  const fetchMessages=async ({pageParam = undefined}) => {
    const url = new URL("http://localhost:3000/api/v1/messages")
    url.searchParams.set(paramKey, paramValue)
    if(pageParam) url.searchParams.set("cursor", pageParam) 
    const token=await getToken() 
    const res = await axios.get(url.toString(),{
      headers: {
       'Authorization':`Bearer ${token}`,
       'Content-Type':'application/json'
      }
    })
     return res.data  
   }

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage, status} =
  useInfiniteQuery({
   queryKey: [queryKey],
   queryFn: fetchMessages,
   getNextPageParam: (lastPage) => lastPage?.nextCursor,
   refetchInterval: isConnected ? false : 1000,
   initialPageParam: undefined
  })

  return {data, fetchNextPage, hasNextPage, isFetchingNextPage, status}
} 
