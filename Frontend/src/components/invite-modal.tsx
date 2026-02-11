import { useState } from "react"
import { useAuth } from "@clerk/clerk-react"
import { useModal } from "store/use-modal-store"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Copy, RefreshCw,Check } from "lucide-react"
import { useOrigin } from "@/hooks/use-origin"
import axios from "axios"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"

export const InviteModal=()=>{
  const {getToken}=useAuth()
  const { onOpen,isOpen,onClose,type,data }=useModal() 
  const { server }=data
  const [copied,setCopied]=useState(false)
  const [isLoading,setIsLoading]=useState(false)
  const origin = useOrigin()

  const isModalOpen=isOpen && type === "invite"

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`

  const onCopy=()=>{
    navigator.clipboard.writeText(inviteUrl)
    setCopied(true)

    setTimeout(()=>{
     setCopied(false)
    },1000)    
  }

  const onNew=async()=>{
    try{
      setIsLoading(true)

      const token=await getToken()
      const response=await axios.patch(`http://localhost:3000/api/v1/server/create-invitecode`,{
        serverId:server?.id,
      },{
        headers:{
         'Authorization':`Bearer ${token}`,
         'Content-Type':'application/json'
        }
      })
      onOpen("invite", { server:response.data })
    }catch(err){
     console.error(err)
    }finally{
     setIsLoading(false)
    }
  }

  return (
     <div>
      <Dialog open={isModalOpen} onOpenChange={onClose}>
       <DialogContent className="sm:max-w-106.25">
         <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
                Invite Friends
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <Label
             className="uppercase text-xs font-bold
             text-zinc-500/90 "
            >
                Server invite link
            </Label>
            <div className="flex items-center mt-2 gap-x-2">
             <Input 
              disabled={isLoading}
              className="bg-zinc-300/50 border-0 focus-visible:ring-0
              text-black focus-visible:ring-offset-0"
              value={inviteUrl}
             />
             <Button disabled={isLoading} onClick={onCopy} size="icon" className="cursor-pointer">
               {copied ? <Check className="text-green-500 w-4 h-4"/> 
                       :<Copy className="w-4 h-4"/>}
             </Button>
            </div>
            <Button
             onClick={onNew}
             disabled={isLoading}
             variant="link"
             size="sm"
             className="text-xs text-zinc-500 mt-2 cursor-pointer"
            >
                Generate a new link
                <RefreshCw className="w-4 h-4 ml-1 cursor-pointer" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>  
     </div>
  )
}