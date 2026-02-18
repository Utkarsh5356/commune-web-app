import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useInitiateProfile } from "@/hooks/use-initiateProfile";
import { useAllServers } from "@/hooks/use-all-servers";
import { useCurrentProfile } from "@/hooks/use-currentProfile"; 
import { ServerNavigation } from "@/components/server-navigation";
import Loader from "@/components/ui/loader";

export const ChannelLayout=()=>{ 
  const {user,isLoaded}=useUser()
  const initiateProfile=useInitiateProfile()
  const {data: profileData,isLoading: profileLoader}=useCurrentProfile() 
  const {data: serverData,isLoading: serverLoader}=useAllServers()
  const navigate=useNavigate()
  
  useEffect(()=>{
   if(isLoaded && !user){
    navigate("/signin")  
  } 
  },[user,isLoaded,navigate])
      

  useEffect(()=>{
    if(!user || !initiateProfile.isIdle) return 
    initiateProfile.mutate()
  },[user,initiateProfile.isIdle])

  if(!isLoaded || profileLoader || serverLoader){
    return <div className="bg-[#2b2c2e] h-screen w-screen flex justify-center items-center"><Loader/></div>
  } 

  return(
    <div>
     <div className="bg-[#343639] flex  text-white h-full">
       <div className=" h-full w-18 z-30
         flex-col fixed inset-y-0">
          <ServerNavigation serverData={serverData}/>
       </div>
     </div>
     <div>
       <Outlet context={profileData}/>
     </div>
  </div>
  ) 
}