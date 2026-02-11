import { ActionTooltip } from "./action-tooltip"
import {useForm} from "react-hook-form"
import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import { ImageUpload } from "./imageUpload"
import { Plus } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useAuth } from "@clerk/clerk-react"
import axios from "axios"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

export const HomeCreateServer=()=>{
  const {getToken}=useAuth()

  const form=useForm({
    resolver:zodResolver(formSchema),
    defaultValues:{
      name:"",
      imageUrl:""
    }
  })

  const isLoading = form.formState.isSubmitting
  
  const onSubmit = async(values:z.infer<typeof formSchema>)=>{
    try{
      const token=await getToken()
      await axios.post("http://localhost:3000/api/v1/server/create",{
        values
      },{
        headers:{
          'Authorization':`Bearer ${token}`,
          'Content-Type':'application/json'
        }
      }
    )
      form.reset()
      window.location.reload()
    }catch(err){
     console.error(err);
    }
  }
  return (
     <div>
      <Dialog>
       <DialogTrigger>  
         <ActionTooltip
          side="right"
          align="center"
          label="Add a server"
         >  
          <button
           className="group flex item-center"
          >
           <div className="flex mx-3 h-12 w-12 rounded-3xl cursor-pointer
           group-hover:rounded-2xl transition-all overflow-hidden 
           items-center justify-center  bg-neutral-700
           group-hover:bg-emerald-500"
           >
            <Plus 
              className="group-hover:text-white transition
              text-emerald-500"
              size={25}
            />
           </div>    
          </button>
         </ActionTooltip>
       </DialogTrigger>
       <DialogContent className="sm:max-w-106.25">
         <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">Create Your Server</DialogTitle>
            <DialogDescription className="text-center">
              Your server is where your friends hang out. Make yours and start talking.
            </DialogDescription>
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
              <DialogFooter className="bg-gray-100 -mx-6 -mb-6 rounded-b-sm px-6 py-4">
                <Button className="w-full" variant="primary" type="submit" disabled={isLoading}>Create</Button>
              </DialogFooter>
           </form>
          </Form>
        </DialogContent>
      </Dialog>  
     </div>
  )
}