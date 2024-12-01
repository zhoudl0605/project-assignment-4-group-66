import { auth } from "../modules/auth";
import { Request, Response, NextFunction } from "express";

export async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // check if request has authorization header
    if (!req.headers.authorization) {
        res.status(401).json({
            status: "error",
            message: "Unauthorized",
        });
        return;
    }

    next();
}
