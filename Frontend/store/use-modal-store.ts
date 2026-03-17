import { type ServerProps } from "@/components/server/server-header";
import type { Channels, ChannelType } from "@/hooks/server/use-server-data";
import {create} from "zustand"

export type ModalType= "createServer" | "invite" | "editServer"
 | "members" | "createChannel" | "leaveServer" | "deleteServer"
 | "deleteChannel" | "editChannel" | "messageFile" | "deleteMessage";

interface ModalData {
  messageId?: string;  
  server?: ServerProps;
  channel?: Channels;
  channelType?: ChannelType;
  query?: Record<string,any>;
}

interface ModalStore {
    type: ModalType | null;
    data: ModalData;
    isOpen: boolean;
    onOpen: (type: ModalType, data?: ModalData) => void;
    onClose: ()=>void;
}

export const useModal = create<ModalStore>((set)=>({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type,data = {}) => set({isOpen: true, type, data}),
    onClose: () => set({type: null , isOpen:false})
}))