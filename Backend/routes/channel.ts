import  Router  from "express";
import type { Response,Request } from "express";
import { clerkMiddleware,getAuth } from "@clerk/express"
import { db } from "../lib/prismaclient.js";
import { ChannelType, MemberRole } from "@prisma/client";

export const channel=Router()

channel.use(clerkMiddleware())

channel.post("/create",async (req:Request,res:Response)=>{
   const {isAuthenticated,userId}=getAuth(req) 

   if(!isAuthenticated) return res.status(401).json("User is not authenticated")

   const serverId=req.query.serverId as string
   const {values}:{values:{name:string,type:ChannelType}}=req.body

   if(!serverId) return res.status(400).json("Missing Server ID")
   if(values.name === "general") return res.status(400).json("Channel name cannot be general")
   
  try{
   const profile=await db.profile.findUnique({
    where:{
      userId:userId
    }
   })
   
   if(!profile) return res.status(500).json("Internal error")

   const server=await db.server.update({
     where: {
        id:serverId,
        members: {
          some: {
            profileId: profile.id,
            role:{
                in: [MemberRole.ADMIN, MemberRole.MODERATOR]
            }
          }
        }
     },
     data:{
      channels: {
        create: {
          profileId: profile.id,
          name: values.name,
          type: values.type
        }
      }
     }
   })

   return res.json(server)
  }catch(err){
    res.status(500).json("Internal Error")
  }
})