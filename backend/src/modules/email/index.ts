import nodemailer from "nodemailer";

interface EmailOptions {
    to: string; // Recipient email address
    subject: string; // Email subject
    text?: string; // Plain text body
    html?: string; // HTML body
}

class EmailModule {
    private transporter: nodemailer.Transporter;

    constructor() {
        console.log("Initializing email module...");
        console.log("SMTP_HOST:", process.env.SMTP_HOST);
        console.log("SMTP_PORT:", process.env.SMTP_PORT);
        console.log("SMTP_USER:", process.env.SMTP_USER);
        console.log("SMTP_PASS:", process.env.SMTP_PASSWORD);

        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.example.com",
            port: parseInt(process.env.SMTP_PORT || "587"),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER || "your_email@example.com", // SMTP username
                pass: process.env.SMTP_PASSWORD || "your_password", // SMTP password
            },
        });
    }

    public async sendEmail(options: EmailOptions): Promise<void> {
        try {
            const mailOptions = {
                from:
                    process.env.SMTP_FROM || '"My App" <no-reply@example.com>', // Sender address
                to: options.to,
                subject: options.subject,
                text: options.text,
                html: options.html,
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log(`Email sent: ${info.messageId}`);
        } catch (error) {
            console.error("Error sending email:", error);
            throw new Error("Failed to send email.");
        }
    }
}

export const emailModule = new EmailModule();
