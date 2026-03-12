import Router from "express"
import {channel} from "./channel.js"
import {server} from "./server.js"
import {profile} from "./profile.js"
import { member } from "./member.js"
import { conversation } from "./conversation.js"
import { messages } from "./messages.js"

export const mainrouter=Router()

mainrouter.use("/channel",channel)
mainrouter.use("/server",server)
mainrouter.use("/profile",profile)
mainrouter.use("/member",member)
mainrouter.use("/conversation",conversation)
mainrouter.use("/messages",messages)