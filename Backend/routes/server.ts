import Router from "express";
import {v4 as uuidv4} from "uuid";
import { db } from "../lib/prismaclient.js";
import { ChannelType, MemberRole } from "@prisma/client";
import type {Request,Response} from "express";
import { clerkMiddleware,getAuth } from "@clerk/express"

export const server=Router()

server.use(clerkMiddleware())

server.post("/create",async(req:Request,res:Response)=>{
  const {isAuthenticated,userId}=getAuth(req)
  if(!isAuthenticated) return res.status(401).json("User is not authenticated")

  const {values}:{values:{name:string,imageUrl:string}}=req.body
  if(!values) return res.status(401).json("Unauthorized")

  try{
    const profile=await db.profile.findUnique({
      where:{
        userId:userId
      }
    })
    
    if(!profile) return res.status(500).json("Internal error")

    const server=await db.server.create({
      data:{
        profileId: profile.id,
        name: values.name,
        imageUrl: values.imageUrl,
        inviteCode: uuidv4(),
        channels: {
            create:[
              {name: "general", profileId: profile.id}
            ]
        },
        members: {
            create:[
                {profileId: profile.id , role: MemberRole.ADMIN}
            ]
        }
      }
    });
    return res.json(server)
  }catch(err){
    return res.status(500).json("Internal Error")
  }
})

server.get("/all",async(req:Request,res:Response)=>{
  const { isAuthenticated,userId }=getAuth(req)

  if(!isAuthenticated) return res.status(401).json("User is not authenticated")
   
   try{
    const profile=await db.profile.findUnique({
      where:{
        userId:userId
      }
    })
    
    if(!profile) return res.status(500).json("Internal error")

    const servers=await db.server.findMany({
      where:{
        members:{
          some:{
            profileId:profile.id
          }
        }
      },
      select:{
        id:true,
        name:true,
        imageUrl:true,
        inviteCode:true,
      } 
    }) 
    return res.json(servers)   
  }catch(err){
   return res.status(500).json("Internal Error")
  }
})

server.get("/info",async(req:Request,res:Response)=>{
   const {isAuthenticated,userId}=getAuth(req) 
   
   if(!isAuthenticated) return res.status(401).json("User ia not authenticated")

   const serverId=req.query.serverId as string
   if(!serverId) return res.status(401).json("Unauthorized")
    
  try{  
   const profile=await db.profile.findUnique({
    where:{
      userId:userId
    }
   })
   
   if(!profile) return res.status(500).json("Internal error")

   const server=await db.server.findUnique({
     where:{
       id: serverId,
       members:{
         some:{
           profileId: profile.id
         }
       }
     }
   })
   return res.json(server)  
  }catch(err){
   return res.status(400).json("Internal Error") 
  } 
})

server.get("/data",async(req:Request,res:Response)=>{
   const {isAuthenticated}=getAuth(req) 

   if(!isAuthenticated) return res.status(401).json("User is not authenticated")

   const serverId=req.query.serverId as string
   if(!serverId) return res.status(401).json("Unauthorized")
  
  try{
   const serverData=await db.server.findUnique({
    where:{
      id:serverId,
    },
    include:{
      channels:{
        orderBy:{
          createdAt: "asc"
        },
      },
      members:{
        include:{
          profile:true
        },
        orderBy:{
          role: "asc"
        }
      }
    }
   })
   return res.json({serverData,ChannelType})
  }catch(err){
   return res.status(500).json("Internal Error")
  }
})

server.patch("/create-invitecode",async(req:Request,res:Response)=>{
   const {isAuthenticated,userId}=getAuth(req) 
     
   if(!isAuthenticated) return res.status(401).json("User is not authenticated") 

   const {serverId}:{serverId:string}=req.body

   if(!serverId) return res.status(400).json("Server ID is missing") 

  try{  
   const profile=await db.profile.findUnique({
    where:{
      userId:userId
    }
   })

   if(!profile) return res.status(500).json("Internal error") 
   
   const server=await db.server.update({
    where:{
      id: serverId,
      profileId:profile.id
    },
    data:{
      inviteCode: uuidv4(), 
    },
   })
   return res.json(server)    
  }catch(err){
   return res.status(500).json("Internal Error")
  }
})

server.get("/invitecode-user-find",async(req:Request,res:Response)=>{

   const inviteCode=req.query.inviteCode as string
   const profileId=req.query.profileId as string
   if(!profileId) return res.status(401).json("Unauthorized")
   if(!inviteCode) return res.status(400).json("InviteCode is missing")

  try{ 
   const server=await db.server.findFirst({
     where:{
       inviteCode:inviteCode,
       members:{
         some:{
           profileId:profileId
         }
       }
     } 
   })
    return res.json(server)     
  }catch(err){
   return res.status(500).json("Internal Error")
  }
})

server.put("/invitecode-add-user",async(req:Request,res:Response)=>{
   const {isAuthenticated,userId}=getAuth(req)
   if(!isAuthenticated) return res.status(401).json("User is not authenticated") 

   const {inviteCode}:{inviteCode:string}=req.body
   if(!inviteCode) return res.status(400).json("InviteCode is missing")
    
  try{
   const profile=await db.profile.findUnique({
    where:{
      userId:userId
    }
   }) 
    
   if(!profile) return res.status(500).json("Internal error")

   const server=await db.server.findFirst({
     where:{
       inviteCode:inviteCode
     }
    })
    if(!server) return res.status(404).json("Invalid invite code")  
    
    const existingMember=await db.member.findFirst({
      where:{
        serverId:server.id,
        profileId:profile.id
      }
    })
    
    if(existingMember) return res.json(server)
    
    await db.member.create({
      data:{
        serverId:server.id,
        profileId:profile.id
      }
    })
    
    return res.json(server) 
  }catch(err){
    return res.status(500).json("Internal Error")
  }
})

server.patch("/customize",async(req:Request,res:Response)=>{
  const {isAuthenticated,userId}=getAuth(req)

  if(!isAuthenticated) return res.status(401).json("User is not authenticated")

  const serverId=req.query.serverId as string
  const {values}:{values:{name:string,imageUrl:string}}=req.body
   
  if(!serverId) return res.status(400).json("Server ID is missing")

  try{
   const profile=await db.profile.findUnique({
    where:{
      userId:userId
    }
   })
    
   if(!profile) return res.status(500).json("Internal error")

   const server=await db.server.update({
    where:{
      id: serverId,
      profileId: profile.id,
    },
    data:{
      name: values.name,
      imageUrl: values.imageUrl
    },
   })
   return res.json(server)    
  }catch(err){
   return res.status(500).json("Internal Error")
  }
})

server.patch("/leave",async(req:Request,res:Response)=>{
  const {isAuthenticated,userId}=getAuth(req)

  if(!isAuthenticated) return res.status(401).json("User is not authenticated")

  const serverId=req.query.serverId as string
 
  if(!serverId) return res.status(400).json("Server ID is missing") 
   
  try{
   const profile=await db.profile.findUnique({
    where:{
      userId:userId
    }
   })

   if(!profile) return res.status(500).json("Internal error")

   const server=await db.server.update({
    where:{
      id:serverId,
      profileId: {
        not: profile.id
      },
      members:{
        some:{
          profileId: profile.id
        }
      }
    },
    data:{
      members: {
        deleteMany: {
          profileId: profile.id
        }
      }
    }
   })
   return res.json(server)
  }catch(err){
   return res.status(500).json("Internal Error")
  }
})

server.delete("/delete",async(req:Request,res:Response)=>{
  const {isAuthenticated,userId}=getAuth(req)

  if(!isAuthenticated) return res.status(401).json("User is not authenticated")

  const serverId=req.query.serverId as string
 
  if(!serverId) return res.status(400).json("Server ID is missing")

  try{ 
   const profile=await db.profile.findUnique({
    where:{
      userId:userId
    }
   })

   if(!profile) return res.status(500).json("Internal error")
    
   const server=await db.server.delete({
    where:{
      id:serverId,
      profileId: profile.id
    }
   })
   return res.json(server)
  }catch(err){
   return res.status(500).json("Internal Error")
  }
})