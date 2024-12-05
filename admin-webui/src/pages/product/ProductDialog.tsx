import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
} from "@mui/material";
import FormBuilder, { FormField } from "../../components/formBuilder";

interface ProductData {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    brand: string;
    sku: string;
    medias: string[];
    specs: string[];
}

export interface ProductDialogProps {
    open: boolean;
    product: ProductData | undefined;
    onClose: (
        action: "edit" | "add" | "cancel",
        updatedProduct?: ProductData
    ) => void;
}

const ProductDialog: React.FC<ProductDialogProps> = ({
    open,
    product,
    onClose,
}) => {
    const [initialValues, setInitialValues] = useState<Record<string, any>>({
        name: "",
        brand: "",
        sku: "",
        category: "",
        price: 0,
        stock: 0,
        medias: [],
        specs: [],
    });

    useEffect(() => {
        if (product == null) {
            setInitialValues({
                name: "",
                category: "",
                brand: "",
                sku: "",
                price: 0,
                stock: 0,
                medias: [],
                specs: [],
            });
        } else if (product) {
            setInitialValues({
                brand: product.brand,
                sku: product.sku,
                name: product.name,
                category: product.category,
                price: product.price,
                stock: product.stock,
                medias: product.medias,
                specs: product.specs,
            });
        }
    }, [product]);

    const formFields: FormField[] = [
        { name: "name", label: "Name", type: "text", required: true },
        { name: "sku", label: "SKU", type: "text", required: true },
        { name: "brand", label: "Brand", type: "text", required: true },
        {
            name: "category",
            label: "Category",
            type: "select",
            options: [
                { value: "desktop", label: "Desktop" },
                { value: "laptop", label: "Laptop" },
                { value: "accessory", label: "Accessory" },
            ],
            required: true,
        },
        { name: "price", label: "Price", type: "number", required: true },
        { name: "stock", label: "Stock", type: "number", required: true },
        { name: "medias", label: "medias", type: "stringArray" },
        { name: "specs", label: "Specs", type: "stringArray" },
    ];

    const handleSubmit = (values: Record<string, any>) => {
        const updatedProduct: ProductData = {
            id: product?.id || Date.now().toString(),
            name: values.name,
            brand: values.brand,
            sku: values.sku,
            category: values.category,
            price: values.price,
            stock: values.stock,
            medias: values.medias,
            specs: values.specs,
        };

        onClose(product ? "edit" : "add", updatedProduct);
    };

    return (
        <Dialog open={open} onClose={() => onClose("cancel")} fullWidth>
            <DialogTitle>
                {product ? "Edit Product" : "Add Product"}
            </DialogTitle>
            <DialogContent>
                <FormBuilder
                    fields={formFields}
                    onSubmit={handleSubmit}
                    initialValues={initialValues}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose("cancel")} color="secondary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProductDialog;
