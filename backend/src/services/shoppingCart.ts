import { ShoppingCartDao } from "../dao/shoppingCart";
import { IShoppingCart } from "../models/shoppingCart";

export class ShoppingCartService {
    private shoppingCartDao: ShoppingCartDao;

    constructor() {
        this.shoppingCartDao = new ShoppingCartDao();
    }

    async getShoppingCartById(userId: string): Promise<IShoppingCart> {
        return await this.shoppingCartDao.getShoppingCart(userId);
    }

    async updateShoppingCartItems(userId: string, products: any) {
        return await this.shoppingCartDao.updateShoppingCartItems(
            userId,
            products
        );
    }

    async addProductToShoppingCart(
        userId: number,
        productId: string,
        quantity: number
    ) {
        return await this.shoppingCartDao.addProductToShoppingCart(
            userId,
            productId,
            quantity
        );
    }

    async clearShoppingCart(userId: number) {
        return await this.shoppingCartDao.clearShoppingCart(userId);
    }

    async removeProductFromShoppingCart(userId: string, productId: string) {
        let shoppingCart = await this.getShoppingCartById(userId);
        let products = shoppingCart.products.filter(
            (product) => product.productId.toString() !== productId
        );

        return await this.shoppingCartDao.updateShoppingCartItems(
            userId,
            products
        );
    }
}
