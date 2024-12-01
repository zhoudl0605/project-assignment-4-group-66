import { NextFunction, Response, Request } from "express";

export class ExceptionController {
    public static async unimplemented(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        res.status(501);
        return res.json({
            status: "error",
            message: "Not implemented",
        });
    }
}
