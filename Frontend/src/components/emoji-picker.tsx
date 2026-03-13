import { Smile } from "lucide-react"
import  Picker  from "@slidoapp/emoji-mart-react"
import data from "@slidoapp/emoji-mart-data"
import {
 Popover,
 PopoverContent,
 PopoverTrigger
} from "./ui/popover"

interface EmojiPickerProps {
  onChange: (value: string) => void  
}

export const EmojiPicker=({onChange}:EmojiPickerProps)=>{
  return (
    <Popover>
      <PopoverTrigger>
       <Smile
        className="cursor-pointer text-zinc-400 hover:text-zinc-300 transition"
       /> 
      </PopoverTrigger>  
      <PopoverContent 
       side="right"
       sideOffset={40}
       className="bg-transparent border-none shadow-none
       drop-shadow-none mb-16"
      >
        <Picker 
         data={data}
         onEmojiSelect={(emoji: any) => onChange(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  )  
}