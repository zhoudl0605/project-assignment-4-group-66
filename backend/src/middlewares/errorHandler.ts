import { Request, Response, NextFunction } from "express";
import { RequestErrorResponse } from "../types";

export function errorHandler(
    err: any, 
    req: Request,
    res: Response,
    next: NextFunction
) {
    res.status(err.status || 500);

    const errorResponse: RequestErrorResponse = {
        status: "error",
        message: err.message || "Internal Server Error",
        statusCode: 500
    };

    console.error("Error occurred:", err);

    res.json(errorResponse);
}
