import { useEffect,useState } from "react";
import { useUser } from "@clerk/react-router";
import { useNavigate } from "react-router";
import { useAuth } from "@clerk/clerk-react"
import axios from "axios"

interface Profile {
  id:string;
  name:string | null;
  imageUrl:string;
  email:string
}
interface profileResponse {
  user:Profile
}

export const useInitiateProfile=()=>{
  const {getToken}=useAuth()
  const{user,isLoaded}=useUser()
  const [loading,isLoading]=useState(true)
  const navigate=useNavigate() 
  
  useEffect(()=>{
   if(!user && isLoaded){
    navigate("/signin")
    return 
   } 
  },[user,isLoaded,navigate])
  
  useEffect(()=>{
    const getUserData=async ()=>{
    if(!user || !isLoaded) return 

    isLoading(true)
      try{
      const token=await getToken()  
      await axios.post<profileResponse>("http://localhost:3000/api/v1/profile/upsert",{
        name:user.username === null ? user.fullName : user.username,
        imageUrl:user.imageUrl,
        email:user.emailAddresses[0].emailAddress
       },{
        headers:{
          'Authorization':`Bearer ${token}`,
          'Content-Type' :'application/json'
        }
       }
      )
      }catch(createError){
        console.error("Profile creation failed",createError)
      }finally{
        isLoading(false)
      }
    }
    getUserData()
  },[user,isLoaded,getToken])
  return {loading}
}