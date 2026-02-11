import { useEffect,useState } from "react"
import { useAuth } from "@clerk/clerk-react"
import axios from "axios"


export interface Servers {
  id: string;
  name: string;
  imageUrl: string;
  inviteCode:string  
}

export const useAllServers=()=>{
  const { getToken }=useAuth()
  const [serverData,setServerData]=useState<Servers[]>([])
  const [serverLoader,setServerLoader]=useState(true)

  useEffect(()=>{
    const getservers=async()=>{
      
      setServerLoader(true)
      try{
        const token=await getToken()
        const servers=await axios.get<Servers[]>(`http://localhost:3000/api/v1/server/all`,{
          headers:{
            'Authorization':`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        })
        setServerData(servers.data)
      }catch(err){
       console.error(err)
      }finally{
        setServerLoader(false)
      }
    }
    getservers()
  },[getToken])
  return {serverData,serverLoader}
}