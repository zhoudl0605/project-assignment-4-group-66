import { ProductService } from "../../services/productService";
import { ProductDao } from "../../dao/productDao";
import { IProduct, ProductModel } from "../../models/product";
import mongoose from "mongoose";

jest.mock("../../dao/productDao");

describe("ProductService", () => {
    let productService: ProductService;
    let productDaoMock: jest.Mocked<ProductDao>;

    const mockProduct = new ProductModel({
        _id: new mongoose.Types.ObjectId("6750816ca12a14ad06d21690"),
        name: "Test Product",
        description: "A test product",
        price: 100,
        category: "laptop",
        brand: "Test Brand",
        sku: "12345",
        stock: 10,
        createdAt: new Date(),
        medias: [],
        specs: [],
    });

    beforeEach(() => {
        productDaoMock = new ProductDao() as jest.Mocked<ProductDao>;
        productService = new ProductService(productDaoMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("createProduct", () => {
        it("should create a product successfully when valid data is provided", async () => {
            productDaoMock.createProduct.mockResolvedValue(mockProduct);
            const result = await productService.createProduct(mockProduct);

            expect(productDaoMock.createProduct).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: "Test Product",
                    description: "A test product",
                    price: 100,
                    category: "laptop",
                    brand: "Test Brand",
                    sku: "12345",
                    stock: 10,
                })
            );

            expect(result).toMatchObject({
                name: "Test Product",
                category: "laptop",
                _id: expect.any(mongoose.Types.ObjectId),
            });
        });

        it("should throw an error when creating a product with invalid data", async () => {
            productDaoMock.createProduct.mockRejectedValue(
                new Error("Invalid data")
            );

            await expect(
                productService.createProduct(new ProductModel())
            ).rejects.toThrow("Failed to create product: Invalid data");
        });
    });

    describe("getProducts", () => {
        it("should return a list of products", async () => {
            productDaoMock.getProducts.mockResolvedValue([mockProduct]);

            const result = await productService.getProducts({});

            expect(productDaoMock.getProducts).toHaveBeenCalledWith({});
            expect(result).toEqual([mockProduct]);
        });

        it("should throw an error if fetching products fails", async () => {
            productDaoMock.getProducts.mockRejectedValue(
                new Error("Database error")
            );

            await expect(productService.getProducts({})).rejects.toThrow(
                "Database error"
            );
        });
    });

    describe("getProductById", () => {
        it("should return a product if found", async () => {
            productDaoMock.getProductById.mockResolvedValue(mockProduct);

            const result = await productService.getProductById("1");

            expect(productDaoMock.getProductById).toHaveBeenCalledWith("1");
            expect(result).toEqual(mockProduct);
        });

        it("should throw an error if fetching fails", async () => {
            productDaoMock.getProductById.mockRejectedValue(
                new Error("Database error")
            );

            await expect(
                productService.getProductById("invalid-id")
            ).rejects.toThrow("Failed to fetch product by ID: Database error");
        });
    });

    describe("deleteProduct", () => {
        it("should delete a product successfully", async () => {
            productDaoMock.deleteProduct.mockResolvedValue(mockProduct);

            const result = await productService.deleteProduct("1");

            expect(productDaoMock.deleteProduct).toHaveBeenCalledWith("1");
            expect(result).toEqual(mockProduct);
        });

        it("should throw an error if deletion fails", async () => {
            productDaoMock.deleteProduct.mockRejectedValue(
                new Error("Database error")
            );

            await expect(
                productService.deleteProduct("invalid-id")
            ).rejects.toThrow("Failed to delete product: Database error");
        });
    });

    // describe("updateProduct", () => {
    it("should update a product successfully when valid data is provided", async () => {
        const updatedProduct = {
            ...mockProduct,
            name: "Updated Product",
        } as unknown as IProduct;

        // 模拟成功返回
        productDaoMock.updateProduct.mockResolvedValue(updatedProduct);

        // 调用 productService 的 updateProduct 方法
        const result = await productService.updateProduct("1", {
            name: "Updated Product",
        });

        // 验证 productDao 的 updateProduct 是否正确被调用
        expect(productDaoMock.updateProduct).toHaveBeenCalledWith("1", {
            name: "Updated Product",
        });

        // 验证返回值是否符合预期
        expect(result).toMatchObject({
            name: "Updated Product",
        });
    });

    it("should throw an error when updating a product with invalid data", async () => {
        // 模拟失败返回
        productDaoMock.updateProduct.mockRejectedValue(
            new Error("Failed to update product")
        );

        // 调用 productService 的 updateProduct 方法，验证是否抛出错误
        await expect(
            productService.updateProduct("invalid-id", {
                name: "Failed Update",
            })
        ).rejects.toThrow("Failed to update product: Failed to update product");

        // 验证 productDao 的 updateProduct 是否正确被调用
        expect(productDaoMock.updateProduct).toHaveBeenCalledWith(
            "invalid-id",
            {
                name: "Failed Update",
            }
        );
    });
});
