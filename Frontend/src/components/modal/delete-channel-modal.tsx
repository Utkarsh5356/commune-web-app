import { useChannelDelete } from "@/hooks/channel/use-channel-delete"
import { useModal } from "store/use-modal-store"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "../ui/dialog"

export const DeleteChannelModal=()=>{
  const channelDelete=useChannelDelete()  
  const { isOpen,onClose,type,data }=useModal() 
  const { server,channel }=data
  
  const isModalOpen=isOpen && type === "deleteChannel"
  
  const deleteChannel=async()=>{
    const deleteChannel=await channelDelete.mutateAsync({channelId: channel?.id,serverId: server?.id})

    if(deleteChannel) onClose()
  }
  
  return (
     <div>
      <Dialog open={isModalOpen} onOpenChange={onClose}>
       <DialogContent className="sm:max-w-106.25">
         <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
               Delete Channel
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
               Are you sure you want to this? <br/> 
               <span className="font-semibold text-indigo-500"> 
                #{channel?.name}
               </span> will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="bg-gray-100 rounded-b-sm -mx-6 -mb-6 px-6 py-4">
            <div className="flex items-center justify-between w-full">
              <Button
                disabled={channelDelete.isPending}
                onClick={onClose}
                variant="ghost"
              >
                Cancel
              </Button>
              <Button
                disabled={channelDelete.isPending}
                variant="primary"
                onClick={()=>deleteChannel()}
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