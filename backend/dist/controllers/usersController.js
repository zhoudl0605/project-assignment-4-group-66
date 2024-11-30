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
exports.UsersController = void 0;
const user_1 = require("../services/user");
class UsersController {
    static getUsersController(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = parseInt(ctx.query.limit) || 10; // 从查询参数中获取limit，默认为10
            const skip = parseInt(ctx.query.skip) || 0; // 从查询参数中获取skip，默认为0
            try {
                const userService = new user_1.UserService();
                const result = yield userService.getUsers(limit, skip);
                // 返回成功响应
                ctx.status = 200;
                ctx.body = {
                    status: "success",
                    result,
                };
            }
            catch (error) {
                console.error("Error while getting users:", error.toString());
                // 返回错误响应
                ctx.status = 500;
                ctx.body = {
                    status: "error",
                    message: "Internal server error",
                };
            }
        });
    }
    static getUserController(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = ctx.request.body;
            const id = ctx.params.id;
            try {
                const userService = new user_1.UserService();
                const user = yield userService.getUserById(id);
                if (!user) {
                    ctx.status = 404;
                    return (ctx.body = {
                        status: "fail",
                        message: "User not found",
                    });
                }
                return (ctx.body = {
                    status: "success",
                    data: user,
                });
            }
            catch (error) {
                console.error("Error while getting user:", error.toString());
                ctx.status = 500;
                return (ctx.body = {
                    status: "error",
                    message: "Internal server error",
                });
            }
        });
    }
    static updateUserController(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = ctx.request.body;
            const id = ctx.params.id;
            try {
                const userService = new user_1.UserService();
                const user = yield userService.updateUser(id, body);
                if (!user) {
                    ctx.status = 404;
                    return (ctx.body = {
                        status: "fail",
                        message: "User not found",
                    });
                }
                return (ctx.body = {
                    status: "success",
                    data: user,
                });
            }
            catch (error) {
                console.error("Error while updating user:", error.toString());
                ctx.status = 500;
                return (ctx.body = {
                    status: "error",
                    message: "Internal server error",
                });
            }
        });
    }
}
exports.UsersController = UsersController;
