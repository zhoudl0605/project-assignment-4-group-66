import bcrypt from "bcrypt";

/**
 * Auth module for utility functions related to authentication
 * @module AuthModule
 */

export class AuthModule {
    public static hashPassword(password: string, salt: string): string {
        // Generate a hash for the password
        return bcrypt.hashSync(password, salt);
    }

    public static async generateSalt(rounds: number = 10): Promise<string> {
        // Generate a random salt
        return bcrypt.genSalt(rounds);
    }

    public static async comparePasswords(
        password: string,
        salt: string,
        hash: string
    ): Promise<boolean> {
        const hashedPassword = this.hashPassword(password, salt);
        return hashedPassword === hash;
    }
}
