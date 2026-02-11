import  Router  from "express";
import { db } from "../lib/prismaclient.js";
import { clerkMiddleware,getAuth } from "@clerk/express"
import type {Response,Request} from "express";
import { MemberRole } from "@prisma/client";

export const member=Router()

member.use(clerkMiddleware())

member.delete("/delete",async (req:Request,res:Response)=>{
  const {isAuthenticated,userId}=getAuth(req)
  
  if(!isAuthenticated) return res.status(401).json("User is not authenticated")

  const memberId=req.get('memberId')
  const serverId=req.query.serverId as string
   
  if(!serverId) return res.status(400).json("Server ID missing")
  if(!memberId) return res.status(400).json("Member ID missing")
   
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
      profileId: profile.id
    },
    data:{
      members:{
        deleteMany: {
          id: memberId,
          profileId: {
            not: profile.id
          }
        }
      }
    },
    include: {
      members:{
        include:{
          profile: true
        },
        orderBy:{
          role: "asc"
        }
      },
    },
   });
   res.json(server)
  }catch(err){
    return res.status(500).json("Internal Error")
  }
})

member.patch("/role-change",async(req:Request,res:Response)=>{
  const {isAuthenticated,userId}=getAuth(req)

  if(!isAuthenticated) return res.status(401).json("User is not authenticated")

  const memberId=req.get('memberId')
  const serverId=req.query.serverId as string
  const role=req.body.role as MemberRole

  if(!serverId) return res.status(400).json("Server ID missing")
  if(!memberId) return res.status(400).json("Member ID missing")

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
        profileId: profile.id
     },
     data:{
        members:{
            update: {
              where:{
                id: memberId,
                profileId: {
                  not: profile.id
                }
              },
              data:{
                role
              }
            }
        }
      },
      include:{
        members: {
          include:{
            profile:true
          },
          orderBy: {
            role: "asc"
          }
        }
      }
   }); 
   return res.json(server)
  }catch(err){
    return res.status(500).json("Internal Error")
  }  
})