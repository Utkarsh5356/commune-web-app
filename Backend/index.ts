import express from "express";
import { createServer } from "http"
import {mainrouter} from "./routes/mainrouter.js";
import { initSocket } from "./socket/index.js";
import cors from "cors"

const app=express();
const httpServer=createServer(app)

app.use(cors())
app.use(express.json())
app.use("/api/v1",mainrouter)

initSocket(httpServer)

httpServer.listen(3000)