import { ServerCreate } from "../server/server-create";
import { InviteModal } from "../modal/invite-modal";
import { EditServer } from "../modal/edit-server-modal";
import { MembersModal } from "../modal/members-modal";
import { CreateChannelModal } from "../modal/create-channel-modal";
import { LeaveServerModal } from "../modal/leave-server-modal";
import { DeleteServerModal } from "../modal/delete-server-modal";
import { DeleteChannelModal } from "../modal/delete-channel-modal";
import { EditChannelModal } from "../modal/edit-channel-modal";

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
     <DeleteChannelModal/>
     <EditChannelModal/>
    </>
  )
}