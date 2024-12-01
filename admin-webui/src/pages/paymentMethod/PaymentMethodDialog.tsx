import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
} from "@mui/material";
import FormBuilder, { FormField } from "../../components/formBuilder";

interface PaymentMethodData {
    id: string;
    userId: string;
    cardType: string;
    cardNumber: string;
    cardName: string;
    expirationDate: string;
    cvv: string;
}

export interface PaymentMethodDialogProps {
    open: boolean;
    paymentMethod: PaymentMethodData | undefined;
    onClose: (
        action: "edit" | "add" | "cancel",
        updatedPaymentMethod?: PaymentMethodData
    ) => void;
}

const PaymentMethodDialog: React.FC<PaymentMethodDialogProps> = ({
    open,
    paymentMethod,
    onClose,
}) => {
    const [initialValues, setInitialValues] = useState<Record<string, any>>({
        userId: "",
        cardType: "",
        cardNumber: "",
        cardName: "",
        expirationDate: "",
        cvv: "",
    });

    useEffect(() => {
        if (!paymentMethod) {
            setInitialValues({
                userId: "",
                cardType: "",
                cardNumber: "",
                cardName: "",
                expirationDate: "",
                cvv: "",
            });
        } else {
            setInitialValues({
                userId: paymentMethod.userId,
                cardType: paymentMethod.cardType,
                cardNumber: paymentMethod.cardNumber,
                cardName: paymentMethod.cardName,
                expirationDate: paymentMethod.expirationDate,
                cvv: paymentMethod.cvv,
            });
        }
    }, [paymentMethod]);

    const formFields: FormField[] = [
        { name: "userId", label: "User ID", type: "text", required: true },
        {
            name: "cardType",
            label: "Card Type",
            type: "select",
            options: [
                { value: "Visa", label: "Visa" },
                { value: "MasterCard", label: "MasterCard" },
                { value: "AmericanExpress", label: "American Express" },
            ],
            required: true,
        },
        {
            name: "cardNumber",
            label: "Card Number",
            type: "text",
            required: true,
        },
        {
            name: "cardName",
            label: "Card Holder Name",
            type: "text",
            required: true,
        },
        {
            name: "expirationDate",
            label: "Expiration Date",
            type: "text",
            required: true,
        },
        { name: "cvv", label: "CVV", type: "text", required: true },
    ];

    const handleSubmit = (values: Record<string, any>) => {
        const updatedPaymentMethod: PaymentMethodData = {
            id: paymentMethod?.id || Date.now().toString(),
            userId: values.userId,
            cardType: values.cardType,
            cardNumber: values.cardNumber,
            cardName: values.cardName,
            expirationDate: values.expirationDate,
            cvv: values.cvv,
        };

        onClose(paymentMethod ? "edit" : "add", updatedPaymentMethod);
    };

    return (
        <Dialog open={open} onClose={() => onClose("cancel")} fullWidth>
            <DialogTitle>
                {paymentMethod ? "Edit Payment Method" : "Add Payment Method"}
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

export default PaymentMethodDialog;
