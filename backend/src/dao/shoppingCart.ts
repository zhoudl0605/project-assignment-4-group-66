import { IShoppingCart, ShoppingCartModel } from "../models/shoppingCart";

export class ShoppingCartDao {
    public async getShoppingCart(userId: string): Promise<IShoppingCart> {
        // get shopping cart from database
        let cart = await ShoppingCartModel.findOne({
            userId,
        });

        if (!cart) {
            // create a new shopping cart if not found
            cart = new ShoppingCartModel({
                userId,
                products: [],
            });
            await cart.save();
        }

        return cart;
    }

    public async updateShoppingCartItems(userId: string, products: any) {
        // add product to shopping cart
        const opts = { new: true, runValidators: true };
        const cart = ShoppingCartModel.findOneAndUpdate(
            { userId },
            {
                $set: {
                    products,
                },
            },
            opts
        );
        return cart;
    }

    public async addProductToShoppingCart(
        userId: number,
        productId: string,
        quantity: number
    ) {
        // add product to shopping cart
        const opts = { new: true, runValidators: true };
        const cart = ShoppingCartModel.findOneAndUpdate(
            { userId },
            {
                $push: {
                    products: [
                        {
                            productId,
                            quantity,
                        },
                    ],
                },
            },
            opts
        );
        return cart;
    }

    public async removeProductFromShoppingCart(
        userId: number,
        productId: string
    ) {
        // remove product from shopping cart
        ShoppingCartModel.findOneAndUpdate(
            { userId },
            { $pull: { products: productId, updatedAt: new Date() } }
        );
        return;
    }

    public async clearShoppingCart(userId: number) {
        // clear shopping cart
        const opts = { new: true, runValidators: true };
        return ShoppingCartModel.findOneAndUpdate(
            { userId },
            {
                $set: {
                    products: [],
                    updatedAt: new Date(),
                },
            },
            opts
        );
    }
}
