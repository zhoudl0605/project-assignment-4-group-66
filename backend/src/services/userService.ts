import { UserDao } from "../dao/user";
import { IUser, UserAddress, UserRole } from "../models/user";
import { UserModel } from "../models/user";
import { auth } from "../modules/auth";
import { DbQueryResult } from "../types";

export class UserService {
    private userDao: UserDao;

    constructor() {
        this.userDao = new UserDao();
    }

    async createUser(
        name: string,
        email: string,
        password: string,
        role: string = "user",
        address: UserAddress = {
            address1: "",
            city: "",
            province: "",
            postalCode: "",
        }
    ): Promise<IUser> {
        try {
            const hashedPass = auth.hashPassword(password);
            const userData: IUser = new UserModel({
                email,
                name,
                password: hashedPass,
                role,
                address,
            });

            return await this.userDao.createUser(userData);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error(String(error));
            }
        }
    }

    async userLogin(
        email: string,
        password: string,
        role: UserRole = UserRole.USER
    ): Promise<IUser | null> {
        try {
            const user = await this.userDao.findUserByEmail(email);

            if (!user) {
                return null;
            }

            const isPasswordMatch = await auth.comparePasswords(
                password,
                user.password
            );

            if (!isPasswordMatch) {
                return null;
            }

            if (role == UserRole.ADMIN && user.role != UserRole.ADMIN) {
                return null;
            }

            return user;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error(String(error));
            }
        }
    }

    async getUserById(id: string): Promise<IUser | null> {
        try {
            return await this.userDao.getUserById(id);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error(String(error));
            }
        }
    }

    async getUsers(
        limit: number,
        skip: number
    ): Promise<DbQueryResult<Object[]>> {
        try {
            const result = await this.userDao.getUsers(limit, skip);
            return {
                ...result,
                data: result.data.map((user) => {
                    return user.toJSON();
                }),
            };
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error(String(error));
            }
        }
    }

    async generateToken(user: IUser): Promise<string> {
        // generate token
        return await auth.generateToken({
            id: user._id,
            email: user.email,
            role: user.role,
        });
    }

    async updateUser(id: string, data: IUser): Promise<IUser | null> {
        try {
            data.password = auth.hashPassword(data.password);
            return await this.userDao.updateUser(id, data);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error(String(error));
            }
        }
    }

    async deleteUser(id: string): Promise<IUser> {
        try {
            return await this.userDao.deleteUser(id);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error(String(error));
            }
        }
    }
}
