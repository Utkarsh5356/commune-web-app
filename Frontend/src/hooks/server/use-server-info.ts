import { useEffect,useState } from "react"
import { useAuth } from "@clerk/clerk-react"
import axios from "axios"

export interface Server{
  id: string;
  profileId: string;
  name: string;
  imageUrl: string;
  inviteCode:string  
}

export const useServerInfo=({serverId}:{serverId:string | undefined})=>{
  const {getToken}=useAuth()
  const [userServerInfo,setUserServerInfo]=useState<Server | null>(null)
  const [userServerLoader,setUserServerLoader]=useState(true)
  
  useEffect(()=>{
    if(!serverId) return 

    const getUserServerData=async()=>{
      try{
       setUserServerLoader(true)

       const token=await getToken()
       const server=await axios.get<Server>(`http://localhost:3000/api/v1/server/info?serverId=${serverId}`,{
        headers:{
          'Authorization':`Bearer ${token}`,
          'Content-Type':'application/json'
        }
       })
       setUserServerInfo(server.data)
      }catch(err){
       console.error(err)
      }finally{
       setUserServerLoader(false)
      }   
    }
    getUserServerData()
  },[serverId,getToken])
  return {userServerInfo,userServerLoader}
}