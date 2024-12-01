import { Request, Response, NextFunction } from "express";
import { RequestErrorResponse } from "../types";

export function errorHandler(
    err: any, // 错误对象
    req: Request,
    res: Response,
    next: NextFunction
) {
    // 设置 HTTP 状态码
    res.status(err.status || 500);

    // 响应的错误信息
    const errorResponse: RequestErrorResponse = {
        status: "error",
        message: err.message || "Internal Server Error",
        statusCode: 500
    };

    // 打印错误日志
    console.error("Error occurred:", err);

    // 返回 JSON 格式的错误信息
    res.json(errorResponse);
}
