import { type ServerProps } from "@/components/server-header";
import type { Channels, ChannelType } from "@/hooks/use-server-data";
import {create} from "zustand"

export type ModalType= "createServer" | "invite" | "editServer"
 | "members" | "createChannel" | "leaveServer" | "deleteServer"
 | "deleteChannel" | "editChannel";

interface ModalData {
  server?: ServerProps
  channel?: Channels
  channelType?: ChannelType
  setServer?: (server:ServerProps)=>void
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