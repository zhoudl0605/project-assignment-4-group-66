import React from "react";
import {
    TextField,
    Select,
    MenuItem,
    Button,
    FormControl,
    InputLabel,
} from "@mui/material";
import Grid from "@mui/material/Grid2"; // 引入 Grid v2

export interface FormField {
    name: string;
    label: string;
    type:
        | "text"
        | "email"
        | "select"
        | "number"
        | "textarea"
        | "stringArray"
        | "password";
    options?: { value: string | number; label: string }[];
    required?: boolean;
}

interface FormBuilderProps {
    fields: FormField[];
    onSubmit: (values: Record<string, any>) => void;
    initialValues: Record<string, any>;
}

const FormBuilder: React.FC<FormBuilderProps> = ({
    fields,
    onSubmit,
    initialValues,
}) => {
    const [formValues, setFormValues] =
        React.useState<Record<string, any>>(initialValues);

    React.useEffect(() => {
        // 初始化时，确保 stringArray 类型被正确处理为字符串
        const initializedValues = fields.reduce((acc, field) => {
            if (
                field.type === "stringArray" &&
                Array.isArray(initialValues[field.name])
            ) {
                acc[field.name] = (initialValues[field.name] as string[]).join(
                    "\n"
                );
            } else {
                acc[field.name] = initialValues[field.name] || "";
            }
            return acc;
        }, {} as Record<string, any>);
        setFormValues(initializedValues);
    }, [fields, initialValues]);

    const handleChange =
        (name: string) =>
        (
            event:
                | React.ChangeEvent<HTMLInputElement>
                | { target: { value: unknown } }
        ) => {
            setFormValues((prev) => ({
                ...prev,
                [name]: event.target.value,
            }));
        };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        // 将 stringArray 类型的字段值转换为 string[]
        const processedValues = fields.reduce((acc, field) => {
            if (field.type === "stringArray") {
                acc[field.name] = formValues[field.name]
                    ? formValues[field.name]
                          .split("\n")
                          .filter((line: string) => line.trim() !== "")
                    : [];
            } else {
                acc[field.name] = formValues[field.name];
            }
            return acc;
        }, {} as Record<string, any>);

        onSubmit(processedValues);
    };

    const renderField = (field: FormField) => {
        switch (field.type) {
            case "select":
                return (
                    <FormControl fullWidth>
                        <InputLabel>{field.label}</InputLabel>
                        <Select
                            value={formValues[field.name] || ""}
                            onChange={(event) =>
                                handleChange(field.name)(
                                    event as React.ChangeEvent<{
                                        value: unknown;
                                    }>
                                )
                            }
                            displayEmpty
                        >
                            {field.options?.map((option) => (
                                <MenuItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                );
            case "textarea":
            case "stringArray":
                return (
                    <TextField
                        fullWidth
                        multiline
                        rows={4} // 默认显示行数，可以根据需要调整
                        label={field.label}
                        value={formValues[field.name] || ""}
                        onChange={handleChange(field.name)}
                        required={field.required}
                    />
                );
            case "password":
                return (
                    <TextField
                        fullWidth
                        type="password"
                        label={field.label}
                        value={formValues[field.name] || ""}
                        onChange={handleChange(field.name)}
                        required={field.required}
                    />
                );
            default:
                return (
                    <TextField
                        fullWidth
                        type={field.type}
                        label={field.label}
                        value={formValues[field.name] || ""}
                        onChange={handleChange(field.name)}
                        required={field.required}
                    />
                );
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2} columns={12}>
                {fields.map((field) => (
                    <Grid size={{ xs: 12 }} key={field.name}>
                        {renderField(field)}
                    </Grid>
                ))}
                <Grid size={{ xs: 12 }}>
                    <Button type="submit" variant="contained" fullWidth>
                        Submit
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default FormBuilder;
