import { ActionTooltip } from "./action-tooltip"
import { Plus } from "lucide-react"
import { useModal } from "store/use-modal-store"

export const NavigationAction=()=>{
  const { onOpen }=useModal()

  return (
   <ActionTooltip
     side="right"
     align="center"
     label="Add a server"
    >  
     <button
      onClick={()=>onOpen("createServer")}
      className="group flex item-center"
     >
      <div className="flex mx-3 h-12 w-12 rounded-3xl cursor-pointer
      group-hover:rounded-2xl transition-all overflow-hidden 
      items-center justify-center  bg-neutral-700
      group-hover:bg-emerald-500"
      >
       <Plus 
         className="group-hover:text-white transition
         text-emerald-500"
         size={25}
       />
     </div>    
     </button>
    </ActionTooltip>
  )
}