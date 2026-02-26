import { useEffect } from "react"
import { useParams,useNavigate } from "react-router"
import { useInviteCodeUser } from "@/hooks/use-invitecode-add-user"
import Loader from "@/components/ui/loader"

export const InviteCodePage=()=>{
 const {inviteCode}=useParams()
 const navigate=useNavigate()

 const inviteCodeUserData=useInviteCodeUser()

 useEffect(()=>{
  if(!inviteCode) return
   inviteCodeUserData.mutate({inviteCode})
 },[inviteCode])

 useEffect(()=>{
  if(inviteCodeUserData.isSuccess){
    navigate(`/channels/${inviteCodeUserData.data.id}`)
   }
 },[inviteCodeUserData.isSuccess])

 if(inviteCodeUserData.isPending){
    return (
      <div className="bg-[#343639] h-screen w-screen flex justify-center items-center">
        <Loader/>
     </div> 
    )
 } 

return null
}  
