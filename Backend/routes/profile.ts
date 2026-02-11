import Router from "express"
import { clerkMiddleware,getAuth } from "@clerk/express"
import { db } from "../lib/prismaclient.js";
import type {Request,Response} from "express";

export const profile=Router()

profile.use(clerkMiddleware())

interface DataType {
 name:string,
 imageUrl:string,
 email:string
}

profile.post("/upsert",async (req:Request,res:Response)=>{
  const {isAuthenticated,userId}=getAuth(req)
  
  if(!isAuthenticated) return res.status(401).json("User is not authenticated")
  
  const data:DataType=req.body;
  if(!data) return res.status(401).json("User is not authorized")  
  try{
  const user=await db.profile.upsert({
     where:{userId:userId},
     update:{
      name:data.name,
      imageUrl:data.imageUrl,
      email:data.email
     },
     create:{
      userId:userId,
      name:data.name,
      imageUrl:data.imageUrl,
      email:data.email
     },
     select:{
      name:true,
      imageUrl:true,
      email:true
     }
   })
   if(!user) return res.status(403).json({err:"invalid inputs"})
   res.json({user})
}catch(err){
 return res.status(500).json("Internal Error")
} 
})

profile.get("/data",async (req:Request,res:Response)=>{
  const {isAuthenticated,userId}=getAuth(req)

  if(!isAuthenticated) return res.status(401).json("User is not authenticated")

  try{
  const user=await db.profile.findUnique({
   where:{
      userId:userId
   },
   select:{
      id:true,
      name:true,
      imageUrl:true,
      email:true
    }
  })  
  if(!user) return res.status(403).json({err:"invalid input"})
  res.json({user})
}catch(err){
 return res.status(500).json("Internal Error")
}
})
