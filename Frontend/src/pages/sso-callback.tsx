import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react"
import Loader from "@/components/ui/loader"

export const SSOcallback=()=>{
  return (
    <div>
     <div className="flex justify-center min-h-screen items-center"><Loader/></div>   
     <AuthenticateWithRedirectCallback/>
    </div>
  )
}