import { Request, Response, NextFunction } from "express";
import { verifyToken } from "./auth/jwt";

declare module "express-serve-static-core" {
    interface Request {
        user: any;
    }
 }

export function authorize(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({message: "Unauthorized"});
    }
    const verifyResult = verifyToken(token.split(" ")[1]);
    if (!verifyResult) {
        return res.status(403).json({message: "Unauthorized"});
    }
    req.user = verifyResult;
    next();
}