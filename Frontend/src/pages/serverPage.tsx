import { useParams } from "react-router"
import { useOutletContext } from "react-router-dom"
import { ServerSidebar } from "@/components/server-sidebar"
import { useServerData } from "@/hooks/use-server-data"
import Loader from "@/components/ui/loader"

export const ServerPage=()=>{
  const {serverId}=useParams()
  const {data: userServerData,isLoading: userServerDataLoader,isFetching}=useServerData({serverId})
  const {id}=useOutletContext<{id:string}>()

  const isServerLoading= userServerDataLoader && !userServerData || isFetching

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
            <div>
              serverContent
            </div>         
           )
          }
         </div> 
       </div>
     </div>
   </div>    
  )
}