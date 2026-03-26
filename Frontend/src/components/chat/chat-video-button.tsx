import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { ActionTooltip } from "../action-tooltip";
import { Video, VideoOff } from "lucide-react"

export const ChatVideoButton = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const isVideo = searchParams.get("video")
  
  const onCLick=()=>{
    const params = new URLSearchParams(searchParams)

    if(isVideo) {
      params.delete("video")  
    }else {
      params.set("video", "true")  
    }
    navigate(`${location.pathname}?${params.toString()}`)
  }

  const Icon = isVideo ? VideoOff : Video
  const tooltipLabel = isVideo ? "End video call" : "Start video call"
  
  return (
   <ActionTooltip side="bottom" label={tooltipLabel}>
     <button onClick={onCLick} className="hover:opacity-75 transition mr-4">
       <Icon className="h-6 w-6 text-zinc-400"/> 
     </button>
   </ActionTooltip>
  )
}