import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react"
import Loader from "@/components/ui/loader"

export const SSOcallback=()=>{
  return (
    <div>
     <div className="flex justify-center bg-[#2b2c2e] min-h-screen items-center"><Loader/></div>   
     <AuthenticateWithRedirectCallback/>
    </div>
  )
}