export function createReminderEmail(
  borrowerName,
  bookTitle,
  dueDate
) {
  return {
    subject: "捷克繁體中文圖書館館藏書籍逾期通知 Library Book Return Reminder",

    body: `Dear ${borrowerName},

This is a friendly reminder that the following library book is overdue.

您借閱的書籍:
${bookTitle}

到期日期:
${dueDate}

Please return the book at your earliest convenience.

Thank you.

捷克繁體中文圖書館 
library@taiwanese.cz`
  };
}
