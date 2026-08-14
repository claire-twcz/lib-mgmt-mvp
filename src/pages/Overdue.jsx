import { useState, useEffect } from "react";

import {
  getTransactions
} from "../services/transactionService";

function Overdue() {
  const [transactions, setTransactions] = useState([]);
  const [sendingId, setSendingId] = useState(null);

  async function loadTransactions() {
    const { data, error } = await getTransactions();

    if (error) {
      console.error("Error loading transactions:", error);
      return;
    }

    setTransactions(data || []);
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  const today = new Date();

  const overdueLoans = transactions.filter((transaction) => {
    if (transaction.status !== "Borrowed") {
      return false;
    }

    return new Date(transaction.due_date) < today;
  });

  async function handleSendReminder(transaction) {
    const borrowerName = transaction.borrowers?.full_name;
    const borrowerEmail = transaction.borrowers?.email;
    const bookTitle = transaction.books?.title;
    const dueDate = transaction.due_date;

    if (!borrowerEmail) {
      alert("This borrower does not have an email address.");
      return;
    }

    setSendingId(transaction.id);

    try {
      const response = await fetch("/api/sendReminder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          borrowerName,
          borrowerEmail,
          bookTitle,
          dueDate
        })
      });

      const result = await response.json();

      if (!response.ok) {
        alert(
          result.message ||
          "Failed to send reminder."
        );
        return;
      }

      alert("Reminder email sent successfully.");
    } catch (error) {
      console.error("Email sending error:", error);
      alert("Unexpected error while sending reminder.");
    } finally {
      setSendingId(null);
    }
  }

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px"
      }}
    >

      {overdueLoans.length === 0 ? (
        <p>No overdue books.</p>
      ) : (
        overdueLoans.map((transaction) => {
          const daysOverdue = Math.floor(
            (today - new Date(transaction.due_date)) /
            (1000 * 60 * 60 * 24)
          );

          return (
            <div
              key={transaction.id}
              style={{
                border: "1px solid #fecaca",
                padding: "16px",
                marginBottom: "12px",
                borderRadius: "10px",
                backgroundColor: "#fff5f5"
              }}
            >
              <h3 style={{ marginTop: "0" }}>
                📖 {transaction.books?.title || "Unknown Book"}
              </h3>

              <p>
                <strong>Borrower:</strong>{" "}
                {transaction.borrowers?.full_name || "Unknown Borrower"}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {transaction.borrowers?.email || "No email available"}
              </p>

              <p>
                <strong>Due Date:</strong>{" "}
                {transaction.due_date}
              </p>

              <p>
                <strong>Days Overdue:</strong>{" "}
                {daysOverdue}
              </p>

              <button
                onClick={() =>
                  handleSendReminder(transaction)
                }
                disabled={sendingId === transaction.id}
                style={{
                  backgroundColor:
                    sendingId === transaction.id
                      ? "#9ca3af"
                      : "#dc2626",
                  color: "white",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: "6px",
                  cursor:
                    sendingId === transaction.id
                      ? "not-allowed"
                      : "pointer"
                }}
              >
                {sendingId === transaction.id
                  ? "Sending..."
                  : "Send Reminder"}
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Overdue;