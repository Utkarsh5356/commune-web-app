import { useState } from "react"
import { useAuth } from "@clerk/clerk-react"
import { useModal } from "store/use-modal-store"
import { Button } from "./ui/button"
import { useNavigate } from "react-router"
import axios from "axios"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "./ui/dialog"

export const DeleteServerModal=()=>{
  const {getToken}=useAuth()
  const navigate=useNavigate()  
  const { isOpen,onClose,type,data }=useModal() 
  const { server }=data
  const [isLoading,setIsLoading]=useState(false)
  
  const isModalOpen=isOpen && type === "deleteServer"
  
  const leave=async()=>{
   try{
    setIsLoading(true)
    const token=await getToken()
    await axios.delete(`http://localhost:3000/api/v1/server/delete?serverId=${server?.id}`,{
      headers:{
       'Authorization':`Bearer ${token}`,
       'Content-Type':'application/json'
      }
    })
    onClose()
    navigate("/channels/@me")
   }catch(err){
    console.error(err)
    setIsLoading(false)   
   }
  }
  
  return (
     <div>
      <Dialog open={isModalOpen} onOpenChange={onClose}>
       <DialogContent className="sm:max-w-106.25">
         <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
               Delete Server
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
               Are you sure you want to this? <br/> 
               <span className="font-semibold text-indigo-500"> 
                {server?.name}
               </span> will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="bg-gray-100 rounded-b-sm -mx-6 -mb-6 px-6 py-4">
            <div className="flex items-center justify-between w-full">
              <Button
                disabled={isLoading}
                onClick={onClose}
                variant="ghost"
              >
                Cancel
              </Button>
              <Button
                disabled={isLoading}
                variant="primary"
                onClick={()=>leave()}
              >
                Confirm
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>  
     </div>
  )
}