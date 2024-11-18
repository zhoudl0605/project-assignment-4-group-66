export class ExceptionController {
    public static async unimplemented(ctx: any) {
        ctx.status = 501;
        ctx.body = {
            status: "error",
            message: "Not implemented",
        };
    }
}
