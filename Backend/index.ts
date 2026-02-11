import express from "express";
import {mainrouter} from "./routes/mainrouter.js";
import cors from "cors"

const app=express();

app.use(cors())
app.use(express.json())
app.use("/api/v1",mainrouter)
app.listen(3000)