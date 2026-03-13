import { useModal } from "store/use-modal-store"
import { useServerEdit } from "@/hooks/server/use-server-edit"
import {useForm} from "react-hook-form"
import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import { FileUpload } from "../file-upload"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "../ui/form"

const formSchema=z.object({
  name:z.string().min(1,{message:"Server name is required"}),
  imageUrl:z.string().min(1,{message:"Server image is required"})
})

export const MessageFileModal=()=>{
  const serverEdit=useServerEdit()
  const { isOpen,onClose,type,data }=useModal() 
  
  const isModalOpen=isOpen && type === "messageFile"
  const {server} = data

  const form=useForm({
    resolver:zodResolver(formSchema),
    defaultValues:{
      imageUrl:""
    }
  })
  
  const isLoading = serverEdit.isPending
  
  const onSubmit = (values:z.infer<typeof formSchema>)=>{
    serverEdit.mutate({values,serverId:server?.id})

    form.reset()
    onClose()
  }
  
  const handleClose = ()=>{
    onClose()
  }

  return (
     <div>
      <Dialog open={isModalOpen} onOpenChange={handleClose}>
       <DialogContent className="sm:max-w-106.25">
         <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">Add an Attachment</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-center text-zinc-500">
            Send a file as a message
          </DialogDescription> 
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} 
              className="space-y-8"
             >
             <div className="space-y-8 px-6">
               <div className="flex items-center justify-center text-center">
                  <FormField
                   control={form.control}
                   name="imageUrl"
                   render={({field})=>(
                     <FormItem>
                        <FormControl>
                          <FileUpload
                           value={field.value}
                           onChange={field.onChange}
                           disabled={isLoading}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
              </div>
              <DialogFooter className="bg-gray-100 -mx-6 -mb-6 rounded-b -sm px-6 py-4">
                <Button className="w-full" variant="primary" type="submit" disabled={isLoading}>Send</Button>
              </DialogFooter>
           </form>
          </Form>
        </DialogContent>
      </Dialog>  
     </div>
  )
}