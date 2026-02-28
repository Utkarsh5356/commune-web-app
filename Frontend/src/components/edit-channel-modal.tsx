import { useChannelEdit } from "@/hooks/use-channel-edit"
import { useModal } from "store/use-modal-store"
import {useForm} from "react-hook-form"
import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "./ui/select" 
import { useEffect } from "react"

const ChannelType={
  text:"TEXT",
  audio:"AUDIO",
  video:"VIDEO"
}

const formSchema=z.object({
  name: z.string().min(1,
    {
     message:"Channel name is required"
    }).refine(name => name !== "general",{
      message: "Channel name cannot be 'general'"
    }),
  type: z.string()
})

export const EditChannelModal=()=>{
  const channelEdit=useChannelEdit()
  const { isOpen,onClose,type,data }=useModal() 
  const {server,channel}=data
  const isModalOpen=isOpen && type === "editChannel"
   
  const form=useForm({
    resolver:zodResolver(formSchema),
    defaultValues:{
      name:"",
      type:ChannelType.text
    }
  })

  useEffect(()=>{
   if (channel) {
    form.setValue("name", channel.name)
    form.setValue("type", channel.type)
   }
  },[form,channel])

  const isLoading = channelEdit.isPending

  const onSubmit = async(values:z.infer<typeof formSchema>)=>{
    const edit=await channelEdit.mutateAsync({values,channelId: channel?.id,serverId: server?.id})
    form.reset()
    if(edit) onClose()
  }
  
  const handleClose = ()=>{
    form.reset()
    onClose()
  }

  return (
     <div>
      <Dialog open={isModalOpen} onOpenChange={handleClose}>
       <DialogContent className="sm:max-w-106.25">
         <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">Edit Channel</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} 
              className="space-y-8"
             >
             <div className="space-y-8 px-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({field})=>(
                    <FormItem>
                      <FormLabel 
                        className="uppercase text-xs font-bold text-zinc-500">
                        Channel Name
                      </FormLabel>
                      <FormControl>
                        <Input 
                         disabled={isLoading}
                         className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black
                         focus-visible:ring-offset-0"
                         placeholder="Enter channel name"
                         {...field}
                        />
                       </FormControl>
                       <FormMessage/>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field })=>(
                    <FormItem>
                      <FormLabel>Channel Type</FormLabel>
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            className="bg-zinc-300/50 w-full border-0
                            focus:ring-0 text-black ring-offset-0
                            focus:ring-offset-0 capitalize outline-none"
                          >
                            <SelectValue placeholder="Select a channel type"/>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(ChannelType).map((type)=>(
                            <SelectItem
                              key={type}
                              value={type}
                              className="capitalize"
                            >
                              {type.toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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