import { useEffect,useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react"
import { setLogLevel, LogLevel } from "livekit-client";
import "@livekit/components-styles"
import { useUser } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";

interface MediaRoomProps {
   chatId: string;
   video: boolean;
   audio: boolean; 
}

setLogLevel(LogLevel.silent)
export const MediaRoom = ({
  chatId,
  video,
  audio  
}: MediaRoomProps) => {
  const { user } = useUser()
  const [token, setToken] = useState("")

  useEffect(()=>{
   if(!user) return 
   
   const name= `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
   user.username ||
   user.emailAddresses?.[0]?.emailAddress ||
   user.id;

   (async () => {
    try{
     const response = await fetch(`http://localhost:3000/api/v1/livekit?room=${chatId}&username=${name}`)
     const data = await response.json()
     setToken(data.token)
    }catch(err){
      // console.error(err);
    }
   })()
  },[user])

  if(token === ""){
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin"/>
        <p className="text-xs text-zinc-400">
          Loading...  
        </p>
      </div>  
    )
  }

  return (
    <LiveKitRoom
     data-lk-theme="default"
     serverUrl={import.meta.env.VITE_LIVEKIT_URL}
     token={token}
     connect={true}
     video={video}
     audio={audio}
    >
      <VideoConference/>
    </LiveKitRoom>
  )
}