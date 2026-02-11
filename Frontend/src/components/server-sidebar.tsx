import { type Profile } from "@/hooks/use-currentProfile";
import { ServerHeader } from "./server-header";
import { type ServerData } from "@/hooks/use-server-data";

interface ServerSidebarProps {
  userServerData: ServerData | null; 
  profileData: Profile | null
}

export const ServerSidebar=({userServerData,profileData}:ServerSidebarProps)=>{

  const textChannels=userServerData?.serverData.channels.filter((channel)=>channel.type === userServerData.ChannelType.TEXT)
  const audioChannels=userServerData?.serverData.channels.filter((channel)=>channel.type === userServerData.ChannelType.AUDIO)
  const videoChannels=userServerData?.serverData.channels.filter((channel)=>channel.type === userServerData.ChannelType.VIDEO)
  const members=userServerData?.serverData.members.filter((member)=>member.profileId !== profileData?.id) 
  
  const role=userServerData?.serverData.members.find((member)=>member.profileId === profileData?.id)?.role
  return (
    <div className="flex flex-col h-screen text-white w-60 bg-[#2B2D31]">
      <ServerHeader serverHeaderData={userServerData?.serverData} role={role}/> 
    </div>
  )
}