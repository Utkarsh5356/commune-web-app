import { useState,useEffect } from "react"
import { useParams } from "react-router"
import { Separator } from "../ui/separator"
import { NavigationAction } from "./navigation-action"
import { ScrollArea } from "../ui/scroll-area"
import { NavigationItem } from "./navigation-item"
import { NavigationAI } from "./navigation-ai"
import { HeaderIcon } from "../header-icon"
import { UserButton } from "@clerk/clerk-react"
import { type Servers } from "@/hooks/server/use-all-servers"

export const ServerNavigation=({serverData}:{serverData:Servers[] | undefined})=>{
  const [showHeaderUI,setShowHeaderUI]=useState(true)
  const {serverId}=useParams()
  
  useEffect(()=>{
    if (serverId) {
      setShowHeaderUI(false)
    } else {
      setShowHeaderUI(true)
    }  
  },[serverId])

  return(
    <div
     className="space-y-4 flex flex-col items-center h-full 
     text-white w-full bg-[#1E1F22] py-3" 
    >
      <div onClick={()=>{setShowHeaderUI(!showHeaderUI)}}><HeaderIcon headerImage={"https://res.cloudinary.com/dk4rdpazd/image/upload/v1779739185/Commune_skpfki.png"} 
        id={"@me"} showHeaderUI={showHeaderUI}/></div>
      <Separator
       className="h-0.5! bg-zinc-700  
       rounded-md w-11! mx-auto"
      />  
      <ScrollArea className="flex-1 h-50 w-full">
       {serverData?.map((server)=>(
        <div key={server.id} className="mb-5">
          <div><NavigationItem id={server.id} name={server.name} imageUrl={server.imageUrl}/></div>
        </div>
       ))}
      </ScrollArea>
      <NavigationAI/>
      <NavigationAction/>
      <div className="relative group flex mx-3 h-12 w-12 rounded-3xl 
       group-hover:rounded-2xl transition-all overflow-hidden"
      >
        <UserButton
         appearance={{
          elements:{
            avatarBox:{
              width: "46px",
              height: "46px",
            }
          }
         }}
        />
      </div>
    </div>    
  )
}