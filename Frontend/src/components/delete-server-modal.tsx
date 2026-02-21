import { useServerDelete } from "@/hooks/use-server-delete"
import { useModal } from "store/use-modal-store"
import { Button } from "./ui/button"
import { useNavigate } from "react-router"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "./ui/dialog"

export const DeleteServerModal=()=>{
  const serverDelete=useServerDelete()
  const navigate=useNavigate()  
  const { isOpen,onClose,type,data }=useModal() 
  const { server }=data
  
  const isModalOpen=isOpen && type === "deleteServer"
  
  const deleteServer=()=>{
    serverDelete.mutate({serverId: server?.id})

    onClose()
    navigate("/channels/@me")
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
                disabled={serverDelete.isPending}
                onClick={onClose}
                variant="ghost"
              >
                Cancel
              </Button>
              <Button
                disabled={serverDelete.isPending}
                variant="primary"
                onClick={()=>deleteServer()}
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