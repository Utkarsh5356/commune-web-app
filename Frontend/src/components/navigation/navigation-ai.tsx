import { ActionTooltip } from "../action-tooltip"
import { Image } from "@unpic/react"
import { useNavigate } from "react-router"

export const NavigationAI=()=>{
  const navigate = useNavigate() 

  return (
   <ActionTooltip
     side="right"
     align="center"
     label="Commune AI"
    >  
     <button
      onClick={()=>navigate("ai")}
      className="group flex item-center"
     >
      <div className="flex mx-3 h-12 w-12 rounded-3xl cursor-pointer
      group-hover:rounded-2xl transition-all overflow-hidden 
      items-center justify-center  bg-neutral-700
      group-hover:bg-emerald-500"
      >
        <Image
         src={"https://static.vecteezy.com/system/resources/previews/049/889/441/non_2x/generate-ai-abstract-symbol-artificial-intelligence-colorful-stars-icon-vector.jpg"}
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