import { UserDao } from "../dao/user";
import { IUser } from "../models/user";
import { UserModel } from "../models/user";

export class UserService {
    private userDao: UserDao;

    constructor() {
        this.userDao = new UserDao();
    }

    async createUser(
        name: string,
        email: string,
        password: string
    ): Promise<IUser> {
        const userData: IUser = new UserModel({ email, name, password });
        

        try {
            return await this.userDao.createUser(userData);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error(String(error));
            }
        }
    }
}
