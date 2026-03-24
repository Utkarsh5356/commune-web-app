import { useMessageDelete } from "@/hooks/message/use-message-delete"
import { useDirectMessageDelete } from "@/hooks/direct-message/use-direct-message-delete"
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

export const DeleteMessageModal=()=>{
  const messageDelete = useMessageDelete() 
  const directMessageDelete = useDirectMessageDelete() 
  const { isOpen,onClose,type,data }=useModal() 
  const { messageId,messageType,query }=data

  const isModalOpen=isOpen && type === "deleteMessage"
  
  const isLoading = messageType === "channel" ? messageDelete.isPending : directMessageDelete.isPending

  const deleteMessage=async()=>{
    const deleteMessage=
      messageType === "channel" ? await messageDelete.mutateAsync({id: messageId,query})
      :
      await directMessageDelete.mutateAsync({id: messageId, query})
    if(deleteMessage) onClose()
  }
  
  return (
     <div>
      <Dialog open={isModalOpen} onOpenChange={onClose}>
       <DialogContent className="sm:max-w-106.25">
         <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
               Delete Message
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
               Are you sure you want to this? <br/> 
               The message will be permanently deleted.
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
                onClick={()=>deleteMessage()}
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