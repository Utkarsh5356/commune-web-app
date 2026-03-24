import { useInfiniteQuery } from "@tanstack/react-query";
import { useSocket } from "@/components/provider/socket-provider";
import { useAuth } from "@clerk/clerk-react"
import axios from "axios";

interface ChatQueryProps {
   apiUrl: string
   queryKey: string;
   paramKey: "channelId" | "conversationId"; 
   paramValue?: string;
}

export const useChatQuery=({
  apiUrl,
  queryKey,
  paramKey,
  paramValue  
}: ChatQueryProps) => {
  const {isConnected} = useSocket()
  const {getToken}=useAuth() 

  const fetchMessages=async ({pageParam = undefined}) => {
    if(!paramValue) return
    const url = new URL(apiUrl)
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
