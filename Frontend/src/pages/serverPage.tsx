import { ServerNavigation } from "@/components/server-navigation"
import { useParams } from "react-router"
import { useCurrentProfile } from "@/hooks/use-currentProfile"
import { useServerInfo } from "@/hooks/use-server-info"
import { ServerSidebar } from "@/components/server-sidebar"
import { useAllServers } from "@/hooks/use-all-servers"
import { useServerData } from "@/hooks/use-server-data"
import Loader from "@/components/ui/loader"

export const ServerPage=()=>{
  const {serverId}=useParams()
  const {profileData,profileLoader}=useCurrentProfile()
  const {userServerInfo,userServerLoader}=useServerInfo({serverId})
  const {serverData,serverLoader}=useAllServers()
  const {userServerData,userServerDataLoader}=useServerData({serverId})
  
  const isServerLoading=userServerLoader || userServerDataLoader
  
  if(!serverId || profileLoader || serverLoader){
    return <div className="bg-[#2b2c2e] h-screen w-screen flex justify-center items-center"><Loader/></div>
  } 

  return (
   <div>
     <div className="bg-[#343639] flex min-h-screen text-white h-full">
       <div className=" h-full w-18 z-30
         flex-col fixed inset-y-0">
          <ServerNavigation serverData={serverData}/>
       </div>
       <div className="h-full">
         <div className="flex h-full pl-18 w-60 z-20
          flex-col inset-y-0">
          {isServerLoading ? (
            <div className="flex-1 flex items-center justify-center">
               <Loader/>
            </div> ):(          
             <ServerSidebar userServerData={userServerData} profileData={profileData}/>
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