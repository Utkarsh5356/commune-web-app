import Router from "express";
import type {Request,Response} from "express"

export const health = Router();

health.get("/",(req: Request,res: Response) => {
    return res.status(200).json({"status": "ok"});
})