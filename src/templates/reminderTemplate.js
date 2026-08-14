export function createReminderEmail(
  borrowerName,
  bookTitle,
  dueDate
) {
  return {
    subject: "捷克繁體中文圖書館館藏書籍逾期提醒 Library Book Return Reminder",

    body: `Dear ${borrowerName},

This is a friendly reminder that the following library book is overdue.

Book:
${bookTitle}

Due Date:
${dueDate}

Please return the book at your earliest convenience.

Thank you.

捷克繁體中文圖書館 
library@taiwanese.cz`
  };
}
