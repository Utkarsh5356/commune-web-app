import { useUser,useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
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
  const {user,isLoaded}=useUser()

  return useQuery({
    queryKey: ["currentProfile"],
    enabled: !!user && isLoaded,
    queryFn: async()=>{
     const token=await getToken()
     const profile=await axios.get<profileResponse>(`http://localhost:3000/api/v1/profile/data`,{
        headers:{
          'Authorization':`Bearer ${token}`,
          'Content-Type':'application/json'
        }
      }) 
      return profile.data.user
    }
  })
}