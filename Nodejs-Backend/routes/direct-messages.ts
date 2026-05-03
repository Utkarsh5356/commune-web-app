import  Router  from "express";
import { db } from "../lib/prismaclient.js";
import { clerkMiddleware,getAuth } from "@clerk/express"
import type {Response,Request} from "express";
import { MemberRole, type DirectMessage } from "@prisma/client";
import { io } from "../socket/index.js";

export const directMessages=Router()

directMessages.use(clerkMiddleware())

directMessages.post("/",async(req: Request,res: Response)=>{
  const {isAuthenticated,userId}=getAuth(req)
  
  if(!isAuthenticated) return res.status(401).json("User is not authenticated")
  
  const {values}:{values:{content: string,fileUrl: string}}=req.body
  const conversationId= req.query.conversationId as string

  if(!values) return res.status(400).json("Values is missing")
  if(!conversationId) return res.status(400).json("Conversation ID is missing")

  try{
    const profile=await db.profile.findUnique({
    where:{
      userId:userId
    }
   })
    
   if(!profile) return res.status(500).json("Internal error")
   
   const conversation = await db.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [
        {
          memberOne: {
            profileId: profile.id
          }  
        },
        {
          memberTwo: {
            profileId: profile.id
          }   
        }
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
   
   if(!conversation) return res.status(404).json("Conversation not found")

   const member= conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwo
   
   if(!member) return res.status(404).json({message: "Member not found"})
   
   const message = await db.directMessage.create({
     data: {
       content: values.content,
       fileUrl: values.fileUrl,
       conversationId,
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
  
  const channelKey = `chat:${conversationId}:messages`
  io.emit(channelKey, message)

  return res.status(200).json(message)
  }catch(err){
    res.status(500).json("Internal error")
  }  
})

directMessages.get("/", async(req: Request,res: Response) => {
 const {isAuthenticated,userId}=getAuth(req)
  
 if(!isAuthenticated) return res.status(401).json("User is not authenticated")
 
 const MESSAGES_BATCH = 10

 const conversationId = req.query.conversationId as string
 const cursor = req.query.cursor as string

 if(!conversationId) return res.status(400).json("Conversation ID is missing")
  
 let messages: DirectMessage[] = []
 
 try{
  const profile=await db.profile.findUnique({
    where:{
      userId:userId
    }
   })
    
  if(!profile) return res.status(500).json("Internal error")

  if(cursor) {
   messages = await db.directMessage.findMany({
     take: MESSAGES_BATCH,
     skip: 1,
     cursor: {
       id: cursor
     },
     where: {
      conversationId
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
   messages = await db.directMessage.findMany({
    take: MESSAGES_BATCH,
    where: {
      conversationId
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

directMessages.patch("/",async(req: Request,res: Response) => {
 const {isAuthenticated,userId}=getAuth(req)
  
 if(!isAuthenticated) return res.status(401).json("User is not authenticated")
 
 const {values}:{values: {content: string}}=req.body 
 const directMessageId=req.query.directMessageId as string
 const conversationId=req.query.conversationId as string
 
 if(!values) return res.status(400).json("Values is missing")
 if(!directMessageId) return res.status(400).json("Direct Message ID is missing")
 if(!conversationId) return res.status(400).json("Conversation ID is missing")

 try{
  const profile=await db.profile.findUnique({
    where:{
      userId:userId
    }
   })
    
  if(!profile) return res.status(500).json("Internal error")

  const conversation = await db.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [
       {
        memberOne: {
           profileId: profile.id 
        }
       },
       {
        memberTwo: {
           profileId: profile.id 
        }
       }
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
  
  if(!conversation) return res.status(404).json("Conversation not found")


  const member = conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwo

  if(!member) return res.status(404).json("Member not found")

  let directMessage = await db.directMessage.findFirst({
    where: {
      id: directMessageId,
      conversationId: conversationId,
    },
    include: {
      member: {
        include: {
          profile: true
        }
      }
    }
  })
  
  if(!directMessage || directMessage.deleted) {
    return res.status(404).json("Message not found")
  }
  
  const isMessageOwner = directMessage.memberId === member.id
  const isAdmin = member.role === MemberRole.ADMIN
  const isModerator = member.role === MemberRole.MODERATOR
  const canModify = isMessageOwner || isAdmin || isModerator

  if(!canModify){
    return res.status(404).json("Unauthorized")
  }
  if(!isMessageOwner){
    return res.status(404).json("Unauthorized")
  }

  const editMessage = await db.directMessage.update({
    where: {
      id: directMessageId,
    },
    data: {
      content: values.content
    },
    include: {
      member: {
        include: {
          profile: true
        }
      }
    }
  })

  const updateKey = `chat:${conversationId}:messages:update`
  io.emit(updateKey, editMessage)

  res.json(editMessage)
 }catch(err){
  res.status(500).json("Internal error")
 }
})

directMessages.delete("/",async(req: Request,res: Response) => {
 const {isAuthenticated,userId}=getAuth(req)
  
 if(!isAuthenticated) return res.status(401).json("User is not authenticated")
 
 const directMessageId=req.query.directMessageId as string
 const conversationId=req.query.conversationId as string
 
 if(!directMessageId) return res.status(400).json("Direct Message ID is missing")
 if(!conversationId) return res.status(400).json("Conversation ID is missing")

 try{
  const profile=await db.profile.findUnique({
    where:{
      userId:userId
    }
   })
    
  if(!profile) return res.status(500).json("Internal error")

  const conversation = await db.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [
       {
        memberOne: {
           profileId: profile.id 
        }
       },
       {
        memberTwo: {
           profileId: profile.id 
        }
       }
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
  
  if(!conversation) return res.status(404).json("Conversation not found")


  const member = conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwo

  if(!member) return res.status(404).json("Member not found")

  let directMessage = await db.directMessage.findFirst({
    where: {
      id: directMessageId,
      conversationId: conversationId,
    },
    include: {
      member: {
        include: {
          profile: true
        }
      }
    }
  })
  
  if(!directMessage || directMessage.deleted) {
    return res.status(404).json("Message not found")
  }
  
  const isMessageOwner = directMessage.memberId === member.id
  const isAdmin = member.role === MemberRole.ADMIN
  const isModerator = member.role === MemberRole.MODERATOR
  const canModify = isMessageOwner || isAdmin || isModerator
  
  if(!canModify){
    return res.status(404).json("Unauthorized")
  }
  
  const deleteMessage = await db.directMessage.update({
    where: {
      id: directMessageId,
    },
    data: {
      fileUrl: null,
      content: "This message has been deleted.",
      deleted: true
    },
    include: {
      member: {
        include: {
          profile: true
        }
      }
    }
  })

  const updateKey = `chat:${conversationId}:messages:update`
  io.emit(updateKey, deleteMessage)

  res.json(deleteMessage)
 }catch(err){
  res.status(500).json("Internal error")
 }
})

