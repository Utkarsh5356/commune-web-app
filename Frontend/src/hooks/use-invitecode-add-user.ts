import { useEffect,useState } from "react"
import { useAuth } from "@clerk/clerk-react"
import axios from "axios"

export const useInviteCodeUser=({inviteCode}:{inviteCode:string | undefined})=>{
  const {getToken}=useAuth()
  const [inviteCodeUserData,setInviteCodeUserData]=useState<any>()  
  const [loading,isLoading]=useState(true)

  useEffect(()=>{
   if(!inviteCode){
    isLoading(false)
    return 
   } 

   const addUserInServer=async()=>{
     isLoading(true)
     try{
      const token=await getToken()    
      const response=await axios.put("http://localhost:3000/api/v1/server/invitecode-add-user",{
       inviteCode
     },{
      headers:{
        'Authorization':`Bearer ${token}`,
        'Content-Type':'application/json'
      }
     })
      setInviteCodeUserData(response.data)
     }catch(err){
      console.error(err)
     }finally{
      isLoading(false)
     }
   }
    addUserInServer()
  ,[inviteCode,getToken]})
  return {inviteCodeUserData,loading}
}