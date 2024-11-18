export class ProductsController {
    public async createProduct(req: Request, res: Response) {
        try {
            const product = await ProductsService.createProduct(req.body);
            res.status(201).json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
