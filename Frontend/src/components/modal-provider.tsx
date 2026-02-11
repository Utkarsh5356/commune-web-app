import { ServerCreate } from "./server-create";
import { InviteModal } from "./invite-modal";
import { EditServer } from "./edit-server";
import { MembersModal } from "./members-modal";
import { CreateChannelModal } from "./create-channel-modal";
import { LeaveServerModal } from "./leave-server-modal";
import { DeleteServerModal } from "./delete-server-modal";

export const ModalProvider=()=>{
  return (
    <>
     <ServerCreate/>
     <InviteModal/> 
     <EditServer/>
     <MembersModal/>
     <CreateChannelModal/>  
     <LeaveServerModal/>
     <DeleteServerModal/>
    </>
  )
}