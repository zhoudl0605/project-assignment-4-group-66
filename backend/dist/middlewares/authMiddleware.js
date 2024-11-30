"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const auth_1 = require("../modules/auth");
function authMiddleware(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // check if request has authorization header
        if (!ctx.headers.authorization) {
            ctx.status = 401;
            ctx.body = {
                status: "error",
                message: "Unauthorized",
            };
            return;
        }
        // get token from authorization header
        const token = ctx.headers.authorization.split(" ")[1];
        // verify token
        const decodedToken = yield auth_1.auth.verifyToken(token);
        // set user in context
        ctx.user = decodedToken;
        yield next();
    });
}
