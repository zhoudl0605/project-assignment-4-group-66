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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Auth module for utility functions related to authentication
 * @module auth
 */
class auth {
    static hashPassword(password_1) {
        return __awaiter(this, arguments, void 0, function* (password, rounds = 10) {
            // Generate a hash for the password
            return bcrypt_1.default.hashSync(password, rounds);
        });
    }
    static generateSalt() {
        return __awaiter(this, arguments, void 0, function* (rounds = 10) {
            // Generate a random salt
            return bcrypt_1.default.genSalt(rounds);
        });
    }
    static comparePasswords(password, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcrypt_1.default.compare(password, hash);
        });
    }
    static generateToken(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            // Generate a JWT token
            const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || "secret", {
                expiresIn: "7d",
            });
            return token;
        });
    }
    static verifyToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verify the token
            return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret");
        });
    }
}
exports.auth = auth;
