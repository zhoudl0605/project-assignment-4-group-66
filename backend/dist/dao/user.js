"use strict";
// src/dao/userDao.ts
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
exports.UserDao = void 0;
const user_1 = require("../models/user");
class UserDao {
    /**
     * create a new user
     * @param userData
     */
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = new user_1.UserModel(userData);
            return yield newUser.save();
        });
    }
    /**
     * find user by id
     * @param id
     */
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_1.UserModel.findById(id);
        });
    }
    /**
     * find user by email
     * @param email
     */
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_1.UserModel.findOne({ email });
        });
    }
    /**
     * update user
     * @param id
     * @param updateData
     */
    updateUser(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const opts = { runValidators: true, new: true };
            return yield user_1.UserModel.findByIdAndUpdate(id, updateData, opts);
        });
    }
    /**
     * delete user
     * @param id
     */
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield user_1.UserModel.findByIdAndDelete(id);
        });
    }
    /**
     * get all users
     */
    getUsers() {
        return __awaiter(this, arguments, void 0, function* (limit = 0, skip = 0) {
            const query = user_1.UserModel.find({});
            if (limit)
                query.limit(limit);
            if (skip)
                query.skip(skip);
            const users = yield query;
            const total = yield user_1.UserModel.countDocuments();
            return {
                data: users,
                limit,
                skip,
                total,
            };
        });
    }
}
exports.UserDao = UserDao;
