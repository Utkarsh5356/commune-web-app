import { ChannelType } from "@/hooks/use-server-data";
import { ServerHeader } from "./server-header";
import { type ServerData } from "@/hooks/use-server-data";
import { ScrollArea } from "./ui/scroll-area";
import { ServerSearch } from "./server-search";
import { Hash,Mic,ShieldCheck,User2,Video } from "lucide-react";

interface ServerSidebarProps {
  userServerData: ServerData | null; 
  profileId: string
}

const iconMap={
  ["TEXT"]: <Hash className="mr-2 h-4 w-4"/>,
  ["AUDIO"]: <Mic className="mr-2 h-4 w-4"/>,
  ["VIDEO"]: <Video className="mr-2 h-4 w-4"/>
}

const roleIconMap={
  ["GUEST"]: <User2 className="h-4 w-4 mr-2"/>,
  ["MODERATOR"]: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500"/>,
  ["ADMIN"]: <ShieldCheck className="h-4 w-4  text-rose-500"/>
}

export const ServerSidebar=({userServerData,profileId}:ServerSidebarProps)=>{

  const textChannels=userServerData?.serverData.channels.filter((channel)=>channel.type === ChannelType.TEXT)
  const audioChannels=userServerData?.serverData.channels.filter((channel)=>channel.type === ChannelType.AUDIO)
  const videoChannels=userServerData?.serverData.channels.filter((channel)=>channel.type === ChannelType.VIDEO)
  const members=userServerData?.serverData.members.filter((member)=>member.profileId !== profileId) 
  
  const role=userServerData?.serverData.members.find((member)=>member.profileId === profileId)?.role

  return (
    <div className="flex flex-col h-screen text-white w-60 bg-[#2B2D31]">
      <ServerHeader serverHeaderData={userServerData?.serverData} role={role}/>
      <ScrollArea className="flex-1 px-3">
        <ServerSearch 
          data={[
            {
              label: "Text Channels",
              type: "channel",
              data: textChannels?.map((channel)=>({
                icon: iconMap[channel.type],
                id: channel.id,
                name: channel.name,
              }))
            },{
              label: "Voice Channels",
              type: "channel",
              data: audioChannels?.map((channel)=>({
                icon: iconMap[channel.type],
                id: channel.id,
                name: channel.name,
              }))
            },{
              label: "Video Channels",
              type: "channel",
              data: videoChannels?.map((channel)=>({
                icon: iconMap[channel.type],
                id: channel.id,
                name: channel.name,
              }))
            },{
              label: "Members",
              type: "member",
              data: members?.map((member)=>({
                icon: roleIconMap[member.role],
                id: member.id,
                name: member.profile.name,
              }))
            }
          ]}
        >

        </ServerSearch>
      </ScrollArea> 
    </div>
  )
}