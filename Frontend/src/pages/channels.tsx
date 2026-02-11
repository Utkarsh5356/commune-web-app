import { HomeNavigation } from "@/components/home-navigation"
import { useInitiateProfile } from "@/hooks/use-initiateProfile"
import { useNavigate } from "react-router"
import { useAllServers } from "@/hooks/use-all-servers"
import Loader from "@/components/ui/loader"

export function Channels(){
  const {loading}=useInitiateProfile() 
  const {serverData,serverLoader}=useAllServers()
  const navigate=useNavigate()
  
  if(serverLoader || loading) {
    return <div className="bg-[#2b2c2e] h-screen w-screen flex justify-center items-center"><Loader/></div>
  }
  if(!serverData){
    navigate("/")
    return
  }

  return (
   <div>
     <div className="bg-[#2b2c2e] flex min-h-screen text-white h-full">
       <div className=" h-full w-18 z-30
         flex-col fixed inset-y-0">
          <HomeNavigation serverData={serverData}/>
       </div>
       <div className="pl-18 h-full">
         homeContent
       </div>
     </div>
    </div>        
  )
}