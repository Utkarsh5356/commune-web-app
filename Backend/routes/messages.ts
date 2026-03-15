import  Router  from "express";
import { db } from "../lib/prismaclient.js";
import { clerkMiddleware,getAuth } from "@clerk/express"
import type {Response,Request} from "express";
import { type Message } from "@prisma/client";
import { io } from "../socket/index.js";

export const messages=Router()

messages.use(clerkMiddleware())

messages.post("/",async(req: Request,res: Response)=>{
  const {isAuthenticated,userId}=getAuth(req)
  
  if(!isAuthenticated) return res.status(401).json("User is not authenticated")
  
  const {values}:{values:{content: string,fileUrl: string}}=req.body
  const serverId= req.query.serverId as string
  const channelId= req.query.channelId as string

  if(!values) return res.status(400).json("Values is missing")
  if(!serverId) return res.status(400).json("Server ID is missing")
  if(!channelId) return res.status(400).json("Channel ID is missing")

  try{
    const profile=await db.profile.findUnique({
    where:{
      userId:userId
    }
   })
    
   if(!profile) return res.status(500).json("Internal error")
   
   const server=await db.server.findFirst({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id  
        }
      }  
    },
    include: {
      members: true  
    }
   })

   if(!server) return res.status(404).json({message: "Server not found"})
   
   const channel= await db.channel.findFirst({
    where: {
      id: channelId,
      serverId: serverId  
    }
   })

   if(!channel) return res.status(404).json({message: "Channel not found"})
 
   
   const member= server.members.find((member) => member.profileId === profile.id) 
   
   if(!member) return res.status(404).json({message: "Member not found"})
   
   const message = await db.message.create({
     data: {
       content: values.content,
       fileUrl: values.fileUrl,
       channelId,
       memberId: member.id  
     },
     include: {
       member: {
         include: {
           profile: true  
         }
       }  
     }
   }) 
  
  const channelKey = `chat:${channelId}:messages`
  io.emit(channelKey, message)

  return res.status(200).json(message)
  }catch(err){
    res.status(500).json("Internal error")
  }  
})

messages.get("/", async(req: Request,res: Response) => {
 const {isAuthenticated,userId}=getAuth(req)
  
 if(!isAuthenticated) return res.status(401).json("User is not authenticated")
 
 const MESSAGES_BATCH = 10

 const channelId = req.query.channelId as string
 const cursor = req.query.cursor as string

 if(!channelId) return res.status(400).json("Channel ID is missing")
  
 let messages: Message[] = []
 
 try{
  const profile=await db.profile.findUnique({
    where:{
      userId:userId
    }
   })
    
  if(!profile) return res.status(500).json("Internal error")

  if(cursor) {
   messages = await db.message.findMany({
     take: MESSAGES_BATCH,
     skip: 1,
     cursor: {
       id: cursor
     },
     where: {
      channelId
     },
     include: {
       member: {
         include: {
           profile: true
         }
       }
     },
     orderBy: {
      createdAt: "desc"
     } 
   })
  }else {
   messages = await db.message.findMany({
    take: MESSAGES_BATCH,
    where: {
      channelId
    },
    include: {
      member: {
        include: {
          profile: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
   })
  }
  
  let nextCursor = null
  
  if(messages.length === MESSAGES_BATCH) {
    nextCursor = messages[MESSAGES_BATCH - 1]?.id
  }
  
  return res.json({
    items: messages,
    nextCursor
  })
 }catch{
  res.status(500).json("Internal error")
 }
})

