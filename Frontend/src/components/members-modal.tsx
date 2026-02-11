import { useModal } from "store/use-modal-store"
import { useAuth } from "@clerk/clerk-react"
import { useState } from "react"
import { ScrollArea } from "./ui/scroll-area"
import { UserAvatar } from "./user-avatar"
import axios from "axios"
import { 
  Shield,
  ShieldCheck,
  ShieldAlert,
  MoreVertical,
  ShieldQuestion,
  User2,
  Check,
  Gavel,
  Loader2 
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuPortal,
 DropdownMenuSeparator,
 DropdownMenuSub,
 DropdownMenuSubContent,
 DropdownMenuTrigger,
 DropdownMenuSubTrigger
} from "./ui/dropdown-menu"

const roleIconMap=(role:string)=>{
  if(role === "GUEST") return null
  if(role === "MODERATOR") return <ShieldCheck className="h-4 w-4  text-indigo-500" />
  if(role === "ADMIN") return <ShieldCheck className="h-4 w-4  text-rose-500"/>
}

export const MembersModal=()=>{
  const { getToken }=useAuth()
  const { onOpen,isOpen,onClose,type,data }=useModal()
  const { server,setServer }=data
  const [loadingId,setLoadingId]=useState("") 

  const isModalOpen=isOpen && type === "members"
  const serverMemberCount=server?.members?.length
  
  const onKick=async(memberId:string)=>{
    try{
      setLoadingId(memberId)
      const token=await getToken()
      const response=await axios.delete(`http://localhost:3000/api/v1/member/delete?serverId=${server?.id}`,{
        headers:{
         'Authorization':`Bearer ${token}`,
         'memberId':memberId,
         'Content-Type':'application/json'
        }
      })
      setServer?.(response.data)
      onOpen("members" , {server:response.data})
    }catch(err){
      console.error(err)
    }finally{
      setLoadingId("")
    }
  }

  const onRoleChange=async(memberId:string,role:string)=>{
    try{
     setLoadingId(memberId)
     const token=await getToken()
     const response=await axios.patch(`http://localhost:3000/api/v1/member/role-change?serverId=${server?.id}`,
      {role},{
        headers:{
          'Authorization':`Bearer ${token}`,
          'memberId':memberId,
          'Content-Type':'application/json'
        }
      }
    )
     setServer?.(response.data)
     onOpen("members" , {server: response.data})
    }catch(err){
     console.error(err)
    }finally{
     setLoadingId("")
    }
  }

  return (
     <div>
      <Dialog open={isModalOpen} onOpenChange={onClose}>
       <DialogContent className="sm:max-w-106.25 overflow-hidden">
         <DialogHeader className="pt-5 px-6">
            <DialogTitle className="text-center text-2xl font-bold">
              Manage Members
            </DialogTitle>
            <DialogDescription
             className="text-center text-zinc-600 font-medium"
            >
             {serverMemberCount == 1 ? `${serverMemberCount} Member` : `${serverMemberCount} Members`}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="mt-8 max-h-105 pr-6">
           {server?.members?.map((member)=>(
            <div key={member.id} className="flex items-center gap-x-2 mb-6">
              <UserAvatar src={member.profile.imageUrl}/>
              <div className="flex flex-col gap-y-1">
               <div className="text-xs font-semibold flex items-center gap-x-1">
                {member.profile.name}
                {roleIconMap(member.role)}
               </div>
               <p className="text-xs text-zinc-600">
                {member.profile.email}
               </p>
              </div>
              {server.profileId !== member.profileId &&
               loadingId !== member.id && (
                <div className="ml-auto">
                  <DropdownMenu>
                   <DropdownMenuTrigger>
                    <MoreVertical className="h-4 w-4 text-zinc-500 cursor-pointer"/>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="flex items-center cursor-pointer">
                        <ShieldQuestion className="w-4 h-4 mr-2"/>
                        <span>Role</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem onClick={()=>onRoleChange(member.id,"GUEST")} className="cursor-pointer">
                           <User2 className="h-4 w-4 mr-2"/> 
                           Guest
                           {member.role === "GUEST" && (
                            <Check
                             className="h-4 w-4 ml-auto"
                            />
                           )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={()=>onRoleChange(member.id,"MODERATOR")} className="cursor-pointer">
                          <ShieldCheck className="h-4 w-4  text-indigo-500" />
                           Moderator
                           {member.role === "MODERATOR" && (
                            <Check
                             className="h-4 w-4 ml-auto"
                            />
                           )}
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={()=>onKick(member.id)} className="cursor-pointer">
                      <Gavel className="h-4 w-4 mr-2"/>
                      Kick
                    </DropdownMenuItem>
                   </DropdownMenuContent>
                  </DropdownMenu>
                </div>
               )
              }
              {loadingId === member.id && (
                <Loader2 
                 className="animate-spin text-zinc-500 ml-auto
                  h-4 w-4"
                />
              )}
            </div>
           ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>  
     </div>
  )
}