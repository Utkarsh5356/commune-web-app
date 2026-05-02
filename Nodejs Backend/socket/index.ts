import { Server as SocketIOServer } from "socket.io"
import { Server as HttpServer } from "http"

export let io: SocketIOServer

export const initSocket= (httpServer: HttpServer) => {
   io= new SocketIOServer(httpServer, {
    cors: {
       origin: "http://localhost:5173",
       methods: ["GET", "POST"],
       credentials: true 
    },
   }); 

   io.on("connection", (socket)=>{
    socket.on("channel:join", ({serverId, channelId})=>{
        const room= `server:${serverId}:channel:${channelId}`
        socket.join(room)
    });

    socket.on("typing:start", ({serverId, channelId, userId, userName}) => {
        const room= `server:${serverId}:channel:${channelId}`
        socket.to(room).emit("typing:start", {userId, userName})
    });

    socket.on("typing:stop", ({serverId, channelId, userId, userName}) => {
        const room= `serverId:${serverId}:channelId${channelId}`
        socket.to(room).emit("typing-stop", {userId, userName})
    });
   });

   return io
}