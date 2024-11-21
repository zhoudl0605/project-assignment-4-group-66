export class ExceptionController {
    public static async unimplemented(ctx: any) {
        ctx.status = 501;
        return ctx.body = {
            status: "error",
            message: "Not implemented",
        };
    }
}
