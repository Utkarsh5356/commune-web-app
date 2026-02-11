import { useEffect,useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

export interface Profile {
  id:string; 
  name:string;
  imageUrl:string;
  email:string
}
interface profileResponse {
  user:Profile
}

export const useCurrentProfile =()=>{
  const { getToken }=useAuth()
  const [profileData,setProfileData]=useState<Profile | null>(null)
  const [profileLoader,setProfileLoader]=useState(true)

  useEffect(()=>{  
    const getCurrentProfile=async()=>{  
        
    setProfileLoader(true)
    try{
      const token=await getToken()
      const profile=await axios.get<profileResponse>(`http://localhost:3000/api/v1/profile/data`,{
        headers:{
          'Authorization':`Bearer ${token}`,
          'Content-Type':'application/json'
        }
      }) 
      setProfileData(profile.data.user)     
    }catch(err){
     console.error(err);
    }finally{
      setProfileLoader(false)
    }
   }
   getCurrentProfile()
  },[getToken])
  return {profileData,profileLoader} 
}