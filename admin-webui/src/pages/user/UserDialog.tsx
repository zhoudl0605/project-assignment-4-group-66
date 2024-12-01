import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
} from "@mui/material";
import FormBuilder, { FormField } from "../../components/formBuilder";

interface UserData {
    id: string;
    name: string;
    email: string;
    role: string;
    address: {
        address1: string;
        address2: string;
        city: string;
        province: string;
        postalCode: string;
    };
}

export interface UserDialogProps {
    open: boolean;
    user: UserData | undefined;
    onClose: (
        action: "edit" | "add" | "cancel",
        updatedUser?: UserData
    ) => void;
}

const UserDialog: React.FC<UserDialogProps> = ({ open, user, onClose }) => {
    const [initialValues, setInitialValues] = useState<Record<string, any>>({
        name: "",
        email: "",
        role: "user",
        address1: "",
        address2: "",
        city: "",
        province: "",
        postalCode: "",
    });

    useEffect(() => {
        if (user == null) {
            setInitialValues({
                name: "",
                email: "",
                role: "user",
                address1: "",
                address2: "",
                city: "",
                province: "",
                postalCode: "",
            });
        } else if (user) {
            setInitialValues({
                name: user.name,
                email: user.email,
                role: user.role,
                address1: user.address.address1,
                address2: user.address.address2,
                city: user.address.city,
                province: user.address.province,
                postalCode: user.address.postalCode,
            });
        }
    }, [user]);

    const formFields: FormField[] = [
        { name: "name", label: "Name", type: "text", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        {
            name: "role",
            label: "Role",
            type: "select",
            options: [
                { value: "admin", label: "Admin" },
                { value: "user", label: "User" },
            ],
            required: true,
        },
        { name: "address1", label: "Address1", type: "text", required: true },
        { name: "address2", label: "Address2", type: "text" },
        { name: "city", label: "City", type: "text", required: true },
        { name: "province", label: "Province", type: "text", required: true },
        {
            name: "postalCode",
            label: "Postal Code",
            type: "text",
            required: true,
        },
    ];

    const handleSubmit = (values: Record<string, any>) => {
        const updatedUser: UserData = {
            id: user?.id || Date.now().toString(), // 新用户生成唯一 ID
            name: values.name,
            email: values.email,
            role: values.role,
            address: {
                address1: values.address1,
                address2: values.address2,
                city: values.city,
                province: values.province,
                postalCode: values.postalCode,
            },
        };

        onClose(user ? "edit" : "add", updatedUser);
    };

    return (
        <Dialog open={open} onClose={() => onClose("cancel")} fullWidth>
            <DialogTitle>{user ? "Edit User" : "Add User"}</DialogTitle>
            <DialogContent
                sx={{
                    overflowY: "auto", // 启用垂直滚动
                    // maxHeight: "70vh", // 固定最大高度
                    my: 2,
                }}
            >
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

export default UserDialog;
