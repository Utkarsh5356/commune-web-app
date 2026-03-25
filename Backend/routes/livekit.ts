import  Router  from "express";
import { AccessToken } from "livekit-server-sdk";
import type{ Request,Response } from "express";

export const livekit = Router() 

livekit.get("/",async(req: Request,res: Response)=>{
  const room = req.query.room as string;
  const username = req.query.username as string

  if(!room) return res.status(400).json({err: "Missing room in query parameter"})
  if(!username) return res.status(400).json({err: "Missing username in query parameter"})

  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: username,
    }
  );

  at.addGrant({
    roomJoin: true,
    room: room,
    canPublish: true,
    canSubscribe: true,
  });

  const token = await at.toJwt();
  res.json({ token });
})