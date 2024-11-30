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
exports.UserService = void 0;
const user_1 = require("../dao/user");
const user_2 = require("../models/user");
const user_3 = require("../models/user");
const auth_1 = require("../modules/auth");
class UserService {
    constructor() {
        this.userDao = new user_1.UserDao();
    }
    createUser(name_1, email_1, password_1) {
        return __awaiter(this, arguments, void 0, function* (name, email, password, role = "user") {
            try {
                password = yield auth_1.auth.hashPassword(password);
                const userData = new user_3.UserModel({
                    email,
                    name,
                    password,
                    role,
                });
                return yield this.userDao.createUser(userData);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message);
                }
                else {
                    throw new Error(String(error));
                }
            }
        });
    }
    userLogin(email_1, password_1) {
        return __awaiter(this, arguments, void 0, function* (email, password, role = user_2.UserRole.USER) {
            try {
                const user = yield this.userDao.findUserByEmail(email);
                if (!user) {
                    return null;
                }
                const isPasswordMatch = yield auth_1.auth.comparePasswords(password, user.password);
                if (!isPasswordMatch) {
                    return null;
                }
                if (role == user_2.UserRole.ADMIN && user.role != user_2.UserRole.ADMIN) {
                    return null;
                }
                return user;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message);
                }
                else {
                    throw new Error(String(error));
                }
            }
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userDao.findUserById(id);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message);
                }
                else {
                    throw new Error(String(error));
                }
            }
        });
    }
    getUsers(limit, skip) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userDao.getUsers(limit, skip);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message);
                }
                else {
                    throw new Error(String(error));
                }
            }
        });
    }
    generateToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            // generate token
            return yield auth_1.auth.generateToken({
                id: user._id,
                email: user.email,
                role: user.role,
            });
        });
    }
    updateUser(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userDao.updateUser(id, data);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message);
                }
                else {
                    throw new Error(String(error));
                }
            }
        });
    }
}
exports.UserService = UserService;
