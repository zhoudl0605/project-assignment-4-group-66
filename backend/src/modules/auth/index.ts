import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * Auth module for utility functions related to authentication
 * @module auth
 */

export class auth {
    public static hashPassword(
        password: string | Buffer,
        rounds: number = 10
    ): string {
        // Generate a hash for the password
        return bcrypt.hashSync(password, rounds);
    }

    public static async comparePasswords(
        password: string,
        hash: string
    ): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    public static async generateToken(payload: any): Promise<string> {
        // Generate a JWT token
        const token = jwt.sign(payload, process.env.JWT_SECRET || "secret", {
            expiresIn: "7d",
        });

        return token;
    }

    public static async verifyToken(token: string): Promise<any> {
        // Verify the token
        return jwt.verify(token, process.env.JWT_SECRET || "secret");
    }
}
