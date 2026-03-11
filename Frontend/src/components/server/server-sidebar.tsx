import { ChannelType } from "@/hooks/server/use-server-data";
import { ServerSection } from "./server-section";
import { ServerChannel } from "./server-channel";
import { ServerHeader } from "./server-header";
import { ServerMember } from "./server-member";
import { type ServerData } from "@/hooks/server/use-server-data";
import { ScrollArea } from "../ui/scroll-area";
import { ServerSearch } from "./server-search";
import { Hash,Mic,ShieldCheck,User2,Video } from "lucide-react";
import { Separator } from "../ui/separator";

interface ServerSidebarProps {
  userServerData: ServerData | undefined; 
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
       <div className="mx-2 -mb-2">
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
          />
       </div> 
       <Separator className="bg-zinc-700 h-0.5! w-55! rounded-md my-2 mx-auto"/>
       <ScrollArea className="flex-1 min-h-0 w-full px-4">
         {!!textChannels?.length && (
          <div className="mb-2">
           <ServerSection 
             sectionType= "channels"
             channelType= {ChannelType.TEXT}
             role={role}
             label="Text Channels"
             server={userServerData?.serverData}
           />
           <div className="space-y-0.5">
             {textChannels.map((channel)=>(
              <ServerChannel
                key={channel.id}
                channel={channel}
                role={role}
                server={userServerData?.serverData}
              />
             ))}
           </div>
          </div>
         )}
         {!!audioChannels?.length && (
          <div className="mb-2">
           <ServerSection 
             sectionType= "channels"
             channelType= {ChannelType.AUDIO}
             role={role}
             label="Voice Channels"
             server={userServerData?.serverData}
           />
           <div className="space-y-0.5">
             {audioChannels.map((channel)=>(
              <ServerChannel
                key={channel.id}
                channel={channel}
                role={role}
                server={userServerData?.serverData}
              />
             ))}
           </div>
         </div>
         )}
         {!!videoChannels?.length && (
          <div className="mb-2">
           <ServerSection 
             sectionType= "channels"
             channelType= {ChannelType.VIDEO}
             role={role}
             label="Video Channels"
             server={userServerData?.serverData}
           />
           <div className="space-y-0.5">
             {videoChannels.map((channel)=>(
              <ServerChannel
                key={channel.id}
                channel={channel}
                role={role}
                server={userServerData?.serverData}
              />
             ))}
           </div>
         </div>
         )}
         {!!members?.length && (
          <div className="mb-2">
           <ServerSection 
             sectionType= "members"
             role={role}
             label="Members"
             server={userServerData?.serverData}
           />
           <div className="space-y-0.5">
             {members.map((member)=>(
              <ServerMember
                key={member.id}
                member={member}
                server={userServerData?.serverData}
              />
             ))}
           </div>
           
          </div>
         )}
       </ScrollArea> 
    </div>
  )
}