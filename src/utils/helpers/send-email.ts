import nodemailer from "nodemailer";

export const sendEmail = async ({
  to,
  subject,
  htm,
}: {
  to: string;
  subject: string;
  htm: string;
}) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_EMAIL_KEY,
      },
    });

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to,
      subject,
      html: htm,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
