import * as z from "zod"
import { useForm } from "react-hook-form";
import { useChatInput } from "@/hooks/chat/use-chat-input";
import { useDirectMessageInput } from "@/hooks/direct-message/use-direct-message-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "store/use-modal-store";
import { EmojiPicker } from "../emoji-picker";
import {
 Form,
 FormControl,
 FormField,
 FormItem
} from "../ui/form"
import { Input } from "../ui/input";
import { Plus } from "lucide-react";

interface ChatInputProps {
  query: Record<string,string>
  name?: string;
  type: "conversation" | "channel";
}

const formSchema = z.object({
  content: z.string().min(1)  
})

export const ChatInput=({
  query,
  name,
  type  
}:ChatInputProps)=>{
 const chatInput=useChatInput()
 const directMessageInput=useDirectMessageInput() 
 const { onOpen }=useModal()

 const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
       content: "" 
    }
 })
 
 const isLoading = type === "channel" ? chatInput.isPending : directMessageInput.isPending

 const onSubmit = async(values: z.infer<typeof formSchema>)=>{
  type === "channel" ? 
  await chatInput.mutateAsync({values,query})
   :
  await directMessageInput.mutateAsync({values,query})
  form.reset()
 }

 return (
   <Form {...form}>
     <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormField
       control={form.control}
       name="content"
       render={({field})=>(
        <FormItem>
          <FormControl>
            <div className="relative p-4 pb-6">
              <button
               type="button"
               onClick={() => onOpen("messageFile" , {query})}
               className="absolute top-7 left-8 h-6 w-6
               bg-zinc-400 hover:bg-zinc-300 transition rounded-full
               p-1 flex items-center justify-center"
              >
               <Plus className="text-[#313338] cursor-pointer"/>
              </button>
              <Input
               disabled={isLoading}
               className="px-14 py-6 font-mono bg-zinc-700/75 border-none
               border-0 focus-visible:ring-0 focus-visible:ring-offset-0
               text-zinc-200"
               placeholder={`Message ${type === "conversation" ? name : "#" + name}`}
               {...field}
              />
              <div className="absolute top-7 right-8">
                <EmojiPicker 
                 onChange={(emoji: string) => field.onChange(`${field.value} ${emoji}`)}
                />
              </div>
            </div>
          </FormControl>  
        </FormItem>
       )}
      />
     </form>
   </Form>
  )  
}