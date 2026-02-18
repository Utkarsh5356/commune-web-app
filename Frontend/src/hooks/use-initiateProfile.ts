import { useUser,useAuth } from "@clerk/clerk-react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios"

export const useInitiateProfile=()=>{
  const {getToken}=useAuth()
  const{user}=useUser()
  const queryClient=useQueryClient()

  return useMutation({
    mutationFn: async()=>{
     if(!user) return  
     const token=await getToken()  
     await axios.post("http://localhost:3000/api/v1/profile/upsert",{
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
    },
    onSuccess: ()=>{
      queryClient.invalidateQueries({queryKey: ["currentProfile"]})
    }
  })
}