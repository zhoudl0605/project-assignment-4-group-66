import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
} from "@mui/material";
import FormBuilder, { FormField } from "../../components/formBuilder";

interface CategoryData {
    id: string;
    name: string;
    description: string;
    image: string;
}

export interface CategoryDialogProps {
    open: boolean;
    category: CategoryData | undefined;
    onClose: (
        action: "edit" | "add" | "cancel",
        updatedCategory?: CategoryData
    ) => void;
}

const CategoryDialog: React.FC<CategoryDialogProps> = ({
    open,
    category,
    onClose,
}) => {
    const [initialValues, setInitialValues] = useState<Record<string, any>>({
        name: "",
        description: "",
        image: "",
    });

    useEffect(() => {
        if (category == null) {
            setInitialValues({
                name: "",
                description: "",
                image: "",
            });
        } else if (category) {
            setInitialValues({
                name: category.name,
                description: category.description,
                image: category.image,
            });
        }
    }, [category]);

    const formFields: FormField[] = [
        { name: "name", label: "Name", type: "text", required: true },
        {
            name: "description",
            label: "Description",
            type: "text",
            required: true,
        },
        { name: "image", label: "Image URL", type: "text" },
    ];

    const handleSubmit = (values: Record<string, any>) => {
        const updatedCategory: CategoryData = {
            id: category?.id || Date.now().toString(),
            name: values.name,
            description: values.description,
            image: values.image,
        };

        onClose(category ? "edit" : "add", updatedCategory);
    };

    return (
        <Dialog open={open} onClose={() => onClose("cancel")} fullWidth>
            <DialogTitle>
                {category ? "Edit Category" : "Add Category"}
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

export default CategoryDialog;
