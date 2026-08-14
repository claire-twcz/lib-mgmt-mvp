import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  const {
    borrowerName,
    borrowerEmail,
    bookTitle,
    dueDate
  } = req.body;

  if (
    !borrowerName ||
    !borrowerEmail ||
    !bookTitle ||
    !dueDate
  ) {
    return res.status(400).json({
      success: false,
      message: "Missing required email information."
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });

    await transporter.sendMail({
      from: `"Taiwanese Library" <${process.env.SMTP_USER}>`,
      to: borrowerEmail,
      subject: "捷克繁體中文圖書館館藏書籍逾期通知 Library Book Return Reminder",
      text: `
Dear ${borrowerName},

This is a friendly reminder that the following library book is overdue.

您借閱的書籍 Book:
${bookTitle}

到期日期 Due Date:
${dueDate}

Please return the book at your earliest convenience.

Thank you.

捷克繁體中文圖書館 
${process.env.SMTP_USER}
      `
    });

    return res.status(200).json({
      success: true,
      message: "Reminder email sent successfully."
    });
  } catch (error) {
    console.error("Email send error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send reminder email."
    });
  }
}