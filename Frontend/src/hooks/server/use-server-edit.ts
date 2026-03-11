import { useQueryClient,useMutation } from "@tanstack/react-query"
import { useAuth } from "@clerk/clerk-react"
import axios from "axios"

export const useServerEdit=()=>{
  const {getToken}=useAuth() 
  const queryClient=useQueryClient()
  
 return  useMutation({
      mutationFn: async({values,serverId}:{values:{name: string,imageUrl: string},serverId: string | undefined})=>{
        const token=await getToken()
        const serverEdit = await axios.patch(`http://localhost:3000/api/v1/server/customize?serverId=${serverId}`,{
        values
        },{
        headers:{
          'Authorization':`Bearer ${token}`,
          'Content-Type':'application/json'
        }
      })
        return serverEdit.data
      },
      onSuccess: ()=>{
        queryClient.invalidateQueries({queryKey: ["allServers"]})
      } 
    })
}