import nodemailer from "nodemailer";
import path from "path";
import dotenv from "dotenv";
import handlebars from "handlebars";
import { readFile } from "fs/promises";

dotenv.config();

const nodeMailerHost = process.env.NODE_MAILER_HOST || "smtp.gmail.com";
const nodeMailerPort = process.env.NODE_MAILER_PORT || "465";
const nodeMailerEmail = process.env.NODE_MAILER_EMAIL!;
const nodeMailerPassword = process.env.NODE_MAILER_PASSWORD!;

interface MailContext {
  name?: string;
  OTP?: string;
  email: string;
  template: string;
  [key: string]: any;
}

class MailService {
  static async renderTemplate(
    templateName: string,
    context: MailContext
  ): Promise<string> {
    const filePath = path.resolve(`./src/mail/templates/${templateName}.hbs`);
    const source = await readFile(filePath, "utf8");
    const compiledTemplate = handlebars.compile(source);
    return compiledTemplate(context);
  }

  static async sendMail(
    recipient: string,
    subject: string,
    context: MailContext
  ): Promise<string> {
    try {
      const htmlContent = await this.renderTemplate(context.template, context);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: nodeMailerHost,
        port: parseInt(nodeMailerPort),
        secure: true,
        auth: {
          user: nodeMailerEmail,
          pass: nodeMailerPassword,
        },
      });

      const mailOptions = {
        from: `"Ecom-Price-Tracker" <${nodeMailerEmail}>`,
        to: recipient,
        subject: subject,
        html: htmlContent,
      };

      await transporter.sendMail(mailOptions);

      return "Mail sent";
    } catch (error) {
      console.error("❌ Failed to send email:", error);
      throw error;
    }
  }

  static async sendProductPriceDropAlert(
    title: string,
    price: number,
    url: string,
    email: string,
    username: string,
    originalPrice: number,
    desiredPrice: number,
    currency: string,
    ecommercePlatform: string,
    savings?: { amount: number; percentage: string } | null,
    imageUrl?: string,
    discount?: string
  ): Promise<void> {
    const context: MailContext = {
      title,
      price,
      url,
      email,
      username,
      originalPrice,
      desiredPrice,
      currency,
      ecommercePlatform,
      imageUrl,
      discount,
      savings,
      template: "alertMail", // without .hbs
    };

    await this.sendMail(email, "Price Drop Alert", context);
  }
}

export default MailService;
