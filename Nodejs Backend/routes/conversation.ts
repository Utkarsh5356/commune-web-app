import  Router  from "express";
import { db } from "../lib/prismaclient.js";
import { clerkMiddleware,getAuth } from "@clerk/express"
import type {Response,Request} from "express";

export const conversation=Router() 

conversation.use(clerkMiddleware())

conversation.get("/find-conversation",async (req: Request,res: Response)=>{
  const {isAuthenticated,userId}=getAuth(req)
 
  if(!isAuthenticated) return res.status(401).json("User is not authenticated")

  const memberOneId=req.get('memberOneId')
  const memberTwoId=req.get('memberTwoId')

  if(!memberOneId) return res.status(400).json("MemberOne ID missing")
  if(!memberTwoId) return res.status(400).json("MemberTwo ID missing")

  try{  
   const profile=await db.profile.findUnique({
    where:{
      userId:userId
    }
   })
  
   if(!profile) return res.status(500).json("Internal error")

   const findConversation=await db.conversation.findFirst({
    where: {
      OR: [
        {AND: [{memberOneId: memberOneId}, {memberTwoId: memberTwoId}]},
        {AND: [{memberOneId: memberTwoId}, {memberTwoId: memberOneId}]}
      ]   
    },
    include: {
      memberOne: {
        include: {
          profile: true
        }
      },
      memberTwo: {
        include: {
          profile: true
        }
      }
    }
   })
   
   if(!findConversation) return res.status(404).json('Conversation not found')

   const isFlipped = findConversation.memberOneId !== memberOneId

   const conversation = isFlipped ? {
    ...findConversation,
    memberOneId: findConversation.memberTwoId,
    memberTwoId: findConversation.memberOneId,
    memberOne: findConversation.memberTwo,
    memberTwo: findConversation.memberOne
   } : findConversation

   return res.json(conversation)
  }catch(err){
    return res.status(500).json("Internal error")
  }   
})

conversation.post("/create-conversation",async (req: Request,res: Response)=>{
  const {isAuthenticated,userId}=getAuth(req)
 
  if(!isAuthenticated) return res.status(401).json("User is not authenticated")

  const {memberOneId,memberTwoId}:{memberOneId: string,memberTwoId: string}=req.body

  if(!memberOneId) return res.status(400).json("MemberOne ID missing")
  if(!memberTwoId) return res.status(400).json("MemberTwo ID missing")

  try{  
   const profile=await db.profile.findUnique({
    where:{
      userId:userId
    }
   })
  
   if(!profile) return res.status(500).json("Internal error")

   const createConversation=await db.conversation.create({
     data: {
       memberOneId,
       memberTwoId
     },
     include: {
       memberOne: {
         include: {
           profile: true  
         } 
       },
       memberTwo: {
         include: {
           profile: true  
         }
       }  
     }
    })
   
   return res.json(createConversation)
  }catch(err){
    return res.status(500).json("Internal error")
  }   
})