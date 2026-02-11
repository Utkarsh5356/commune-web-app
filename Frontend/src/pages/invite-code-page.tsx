import { useParams,useNavigate } from "react-router"
import { useInviteCodeUser } from "@/hooks/use-invitecode-add-user"
import Loader from "@/components/ui/loader"

export const InviteCodePage=()=>{
 const {inviteCode}=useParams()
 const navigate=useNavigate()

 const {inviteCodeUserData,loading}=useInviteCodeUser({inviteCode})
 
 if(loading) return <div className="bg-[#343639] h-screen w-screen flex justify-center items-center"><Loader/></div> 
 
 if(inviteCodeUserData){
  navigate(`/channels/${inviteCodeUserData.id}`)
  return
 }
 
 return null
}  
