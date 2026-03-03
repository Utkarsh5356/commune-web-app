import { useEffect } from "react"
import { useParams,useNavigate } from "react-router"
import { useOutletContext,Outlet } from "react-router-dom"
import { ServerSidebar } from "@/components/server-sidebar"
import { useServerData } from "@/hooks/use-server-data"
import Loader from "@/components/ui/loader"

export const ServerPage=()=>{
  const {serverId, channelId, memberId}=useParams()
  const {data: userServerData,isLoading: userServerDataLoader}=useServerData({serverId})
  const {id}=useOutletContext<{id:string}>()
  const navigate=useNavigate()
  
  const isServerLoading= userServerDataLoader && !userServerData 
  
  useEffect(()=>{
    const channels=userServerData?.serverData.channels
    if(!channels || channels.length === 0) return
    let generalChannelId=channels.map((id)=>id.name === "general" ? id.id:undefined)
    
    navigate(`channel/${generalChannelId[0]}`)
  },[userServerData])
  
  const params={channelId,memberId}
  return (
   <div>
     <div className="bg-[#343639] flex min-h-screen w-screen text-white h-full">
      <div className="h-full">
       <div className="flex h-full pl-18 w-60 z-20
        flex-col inset-y-0">
        {isServerLoading ? (
          <div className="flex-1 flex items-center justify-center">
             <Loader/>
          </div> ):(          
           <ServerSidebar userServerData={userServerData} profileId={id}/>
          )
        }
       </div>
       </div>
       <div className="pl-18 h-full">
         <div className="h-full">
          {isServerLoading ? (
           <div className="flex-1 flex items-center justify-center">
              <Loader/>
           </div> ):(
            <div className="flex-1 h-full">
             {channelId || memberId ? <Outlet context={params}/> : <Loader/>}
            </div>
           )
          }
         </div> 
       </div>
     </div>
   </div>    
  )
}