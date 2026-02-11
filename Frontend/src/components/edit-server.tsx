import { useModal } from "store/use-modal-store"
import { useAuth } from "@clerk/clerk-react"
import {useForm} from "react-hook-form"
import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import { ImageUpload } from "./imageUpload"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import axios from "axios"
import { useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
  FormMessage
} from "./ui/form"

const formSchema=z.object({
  name:z.string().min(1,{message:"Server name is required"}),
  imageUrl:z.string().min(1,{message:"Server image is required"})
})

export const EditServer=()=>{
  const {getToken}=useAuth()
  const { isOpen,onClose,type,data }=useModal() 
  
  const isModalOpen=isOpen && type === "editServer"
  const {server} = data

  const form=useForm({
    resolver:zodResolver(formSchema),
    defaultValues:{
      name:"",
      imageUrl:""
    }
  })
  
  useEffect(()=>{
    if(server){
      form.setValue("name" , server.name)
      form.setValue("imageUrl" , server.imageUrl)  
    }
  },[server,form])

  const isLoading = form.formState.isSubmitting
  
  const onSubmit = async(values:z.infer<typeof formSchema>)=>{
    try{
      const token=await getToken()
      await axios.patch(`http://localhost:3000/api/v1/server/customize?serverId=${server?.id}`,{
        values
      },{
        headers:{
          'Authorization':`Bearer ${token}`,
          'Content-Type':'application/json'
        }
      })
      form.reset()
      onClose()
      window.location.reload()
    }catch(err){
     console.error(err);
    }
  }
  
  const handleClose = ()=>{
    onClose()
  }

  return (
     <div>
      <Dialog open={isModalOpen} onOpenChange={handleClose}>
       <DialogContent className="sm:max-w-106.25">
         <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">Customize Your Server</DialogTitle>
          </DialogHeader>
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
                          <ImageUpload
                           value={field.value}
                           onChange={field.onChange}
                           disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage className="w-24"/>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({field})=>(
                    <FormItem>
                      <FormLabel 
                        className="uppercase text-xs font-bold text-zinc-500">
                        Server Name
                      </FormLabel>
                      <FormControl>
                        <Input 
                         disabled={isLoading}
                         className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black
                         focus-visible:ring-offset-0"
                         placeholder="Enter server name"
                         {...field}
                        />
                       </FormControl>
                       <FormMessage/>
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="px-6">
                <Button variant="primary" type="submit" disabled={isLoading}>Save</Button>
              </DialogFooter>
           </form>
          </Form>
        </DialogContent>
      </Dialog>  
     </div>
  )
}