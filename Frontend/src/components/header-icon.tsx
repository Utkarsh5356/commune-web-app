import {Image} from "@unpic/react"
import { useParams,useNavigate } from "react-router";
import { cn } from "@/lib/utils"
import { ActionTooltip } from "./action-tooltip"

export const HeaderIcon=({headerImage,id}:{headerImage:string,id:string})=>{
 const navigate=useNavigate()
 const {serverId}=useParams()   
 return(
   <ActionTooltip
      side="right"
      align="center"
      label="Home"
    >
     <button
      onClick={()=>{navigate(`/channels/${id}`)}}
      className="group relative flex items-center cursor-pointer"
     >
      <div className={cn(
        "absolute left-0 bg-white rounded-r-full transition-all w-1",
        serverId !== id && "group-hover:h-5",
        serverId === id ? "h-9" : "h-2"
      )} />
       <div className={cn(
         "relative group flex mx-3 h-12 w-12 rounded-3xl group-hover:rounded-2xl transition-all overflow-hidden",
         serverId === id && "bg-white/10 text-white rounded-2xl"
       )}>
        <Image
         src={headerImage}
         width={800}
         height={600}
         layout="constrained"
         alt="Channel"
        />
      </div>
     </button>
    </ActionTooltip> 
 )
}