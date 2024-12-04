import { UserService } from "../../services/userService";
import { UserDao } from "../../dao/user";
import { auth } from "../../modules/auth";
import { UserModel, UserRole } from "../../models/user";

jest.mock("../../dao/user"); // Mock UserDao
jest.mock("../../modules/auth"); // Mock auth module

describe("UserService", () => {
    let userService: UserService;
    let userDaoMock: jest.Mocked<UserDao>;

    beforeEach(() => {
        userService = new UserService();
        userDaoMock = UserDao.prototype as jest.Mocked<UserDao>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("createUser", () => {
        it("should create a user with hashed password", async () => {
            const mockUser = new UserModel({
                _id: "1",
                email: "test@example.com",
                name: "Test User",
                password: "hashed_password",
                role: UserRole.USER,
                address: {
                    address1: "123 Main St",
                    city: "Test City",
                    province: "ON",
                    postalCode: "12345",
                },
            });

            jest.spyOn(auth, "hashPassword").mockReturnValue("hashed_password");
            userDaoMock.createUser.mockResolvedValue(mockUser);

            const result = await userService.createUser(
                "Test User",
                "test@example.com",
                "password123"
            );

            expect(auth.hashPassword).toHaveBeenCalledWith("password123");
            expect(userDaoMock.createUser).toHaveBeenCalledWith(
                expect.objectContaining({
                    email: "test@example.com",
                    name: "Test User",
                    password: "hashed_password",
                })
            );
            expect(result).toEqual(mockUser);
        });
    });

    describe("userLogin", () => {
        it("should return null if user not found", async () => {
            userDaoMock.findUserByEmail.mockResolvedValue(null);

            const result = await userService.userLogin(
                "test@example.com",
                "password123"
            );

            expect(userDaoMock.findUserByEmail).toHaveBeenCalledWith(
                "test@example.com"
            );
            expect(result).toBeNull();
        });

        it("should return null if password does not match", async () => {
            const mockUser = new UserModel({
                _id: "1",
                email: "test@example.com",
                name: "Test User",
                password: "hashed_password",
                role: "user",
                address: {
                    address1: "",
                    city: "",
                    province: "",
                    postalCode: "",
                },
            });

            userDaoMock.findUserByEmail.mockResolvedValue(mockUser);
            jest.spyOn(auth, "comparePasswords").mockResolvedValue(false);

            const result = await userService.userLogin(
                "test@example.com",
                "wrong_password"
            );

            expect(auth.comparePasswords).toHaveBeenCalledWith(
                "wrong_password",
                "hashed_password"
            );
            expect(result).toBeNull();
        });

        it("should return user if credentials are correct", async () => {
            const mockUser = new UserModel({
                _id: "1",
                email: "test@example.com",
                name: "Test User",
                password: "hashed_password",
                role: UserRole.USER,
                address: {
                    address1: "",
                    city: "",
                    province: "",
                    postalCode: "",
                },
            });

            userDaoMock.findUserByEmail.mockResolvedValue(mockUser);
            jest.spyOn(auth, "comparePasswords").mockResolvedValue(true);

            const result = await userService.userLogin(
                "test@example.com",
                "password123"
            );

            expect(result).toEqual(mockUser);
        });
    });

    describe("generateToken", () => {
        it("should generate a valid token", async () => {
            const mockUser = new UserModel({
                email: "test@example.com",
                name: "Test User",
                password: "hashed_password",
                role: UserRole.USER,
                address: {
                    address1: "",
                    city: "",
                    province: "",
                    postalCode: "",
                },
            });

            jest.spyOn(auth, "generateToken").mockResolvedValue("mock_token");

            const token = await userService.generateToken(mockUser);

            expect(auth.generateToken).toHaveBeenCalledWith({
                id: mockUser._id,
                email: "test@example.com",
                role: UserRole.USER,
            });
            expect(token).toBe("mock_token");
        });
    });

    describe("getUserById", () => {
        it("should return user if found", async () => {
            const mockUser = new UserModel({
                _id: "1",
                email: "test@example.com",
                name: "Test User",
                password: "hashed_password",
                role: UserRole.USER,
                address: {
                    address1: "",
                    city: "",
                    province: "",
                    postalCode: "",
                },
            });

            userDaoMock.getUserById.mockResolvedValue(mockUser);

            const result = await userService.getUserById("1");

            expect(userDaoMock.getUserById).toHaveBeenCalledWith("1");
            expect(result).toEqual(mockUser);
        });
    });
});
