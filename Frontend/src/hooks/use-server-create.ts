import { useQueryClient,useMutation } from "@tanstack/react-query"
import { useAuth } from "@clerk/clerk-react"
import axios from "axios"

export const useServerCreate=()=>{
  const {getToken}=useAuth() 
  const queryClient=useQueryClient()
  
 return  useMutation({
      mutationFn: async({values}:{values:{name: string,imageUrl: string}})=>{
        const token=await getToken()
        const serverData = await axios.post("http://localhost:3000/api/v1/server/create",{
          values
          },{
          headers:{
           'Authorization':`Bearer ${token}`,
           'Content-Type':'application/json'
          }
        })
        return serverData.data
      },
      onSuccess: (newServerData)=>{
        queryClient.setQueryData(["allServers"],(old: any)=>{
            if(!old) return [newServerData]
            return [...old , newServerData]
        })
      } 
    })
}