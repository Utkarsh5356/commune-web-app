import { useState,useEffect } from "react"; 
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from "./ui/command"

interface ServerSearchProps{
  data:{
    label: string;
    type: "channel" | "member";
    data: {
        icon: React.ReactNode;
        name: string;
        id: string;
    }[] | undefined
  }[]  
}

export const ServerSearch=({data}:ServerSearchProps)=>{
  const [open,setOpen]=useState(false)
  
  useEffect(()=>{
    const down = (e: KeyboardEvent)=>{
      if(e.key === "k" && (e.metaKey || e.ctrlKey)){
        e.preventDefault()
        setOpen((open)=>!open)
      } 
    }
    document.addEventListener("keydown" , down);
    return ()=>document.removeEventListener("keydown" , down)
  },[])

  return (
    <>
     <button
      onClick={()=>setOpen(true)}
      className="group my-2 px-2 py-2 rounded-md flex
      items-center gap-x-2 w-full hover:bg-zinc-700/40
      transition cursor-pointer"
     >
      <Search className="w-4 h-4 text-zinc-400 group-hover:text-zinc-200 transition"/>
      <p
       className="font-semibold text-sm text-zinc-400
       group-hover:text-zinc-200 transition"
      >
        Search
      </p>
      <kbd
       className="pointer-events-none inline-flex h-5 select-none
       items-center gap-1 rounded  bg-zinc-800 px-1.5 font-mono
       text-[10px] font-medium text-muted-foreground ml-auto"
      >
        <span className="text-xs text-zinc-200 w-14">Ctrl + K</span>
      </kbd>
     </button>
     <CommandDialog open={open} onOpenChange={setOpen}>
       <CommandInput placeholder="Search all channels and members"/>
       <CommandList>
        <CommandEmpty>
         No Results found
        </CommandEmpty>
        {data.map(({data,label,type})=>{
          if(!data?.length) return null

          return (
            <CommandGroup key={label} heading={label}>
              {data?.map(({id,icon,name})=>{
                return (
                  <CommandItem key={id} className="cursor-pointer">
                    {icon}
                    <span>{name}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          )
        })}
       </CommandList>
     </CommandDialog>
    </>
  )   
}