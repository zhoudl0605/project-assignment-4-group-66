import { NextFunction, Request, Response } from "express";
import { emailModule } from "../modules/email";

export class TestController {
    public static async sendTestEmail(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            let to = req.body.to;

            await emailModule.sendEmail({
                // to: "alex.zhou0605@gmail.com",
                // to: "sshang8@uwo.ca",
                to: "hshen232@uwo.ca",
                subject: "Test Email",
                text: "This is a test email from the server.",
            });
            return res.status(200).json({
                status: "success",
                message: "Test email sent.",
            });
        } catch (error: any) {
            console.error(`[TestController][sendTestEmail] Error: ${error}`);
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        }
    }
}
