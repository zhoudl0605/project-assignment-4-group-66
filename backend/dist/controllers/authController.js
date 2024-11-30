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
exports.AuthController = void 0;
const user_1 = require("../services/user");
class AuthController {
    static signupController(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = ctx.request.body;
            const name = body.name;
            const email = body.email;
            const password = body.password;
            const role = body.role || "user";
            try {
                const userService = new user_1.UserService();
                const user = yield userService.createUser(name, email, password, role);
                // create JWT token
                const token = yield userService.generateToken(user);
                return (ctx.body = {
                    status: "success",
                    data: {
                        token,
                    },
                });
            }
            catch (error) {
                console.error("Error while creating user", error.toString());
                // handle duplicate email error
                if (error.message.includes("duplicate key error", "email")) {
                    ctx.status = 400;
                    ctx.body = {
                        status: "error",
                        message: "Email already exists",
                    };
                    return;
                }
                ctx.status = 500;
                ctx.body = {
                    status: "error",
                    message: "Internal server error",
                };
                return;
            }
        });
    }
    static loginController(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = ctx.request.body;
            const email = body.email;
            const password = body.password;
            const role = body.role || "user";
            try {
                const userService = new user_1.UserService();
                const user = yield userService.userLogin(email, password, role);
                if (!user) {
                    ctx.status = 401;
                    ctx.body = {
                        status: "error",
                        message: "Invalid email or password",
                    };
                    return;
                }
                const token = yield userService.generateToken(user);
                return (ctx.body = {
                    status: "success",
                    data: {
                        token,
                    },
                });
            }
            catch (error) {
                console.error("Error while logging in user", error.toString());
                ctx.status = 500;
                ctx.body = {
                    status: "error",
                    message: "Internal server error",
                };
                return;
            }
        });
    }
}
exports.AuthController = AuthController;
