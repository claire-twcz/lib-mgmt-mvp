import { useState, useEffect } from "react";
import { getTransactions } from "../services/transactionService";

function Overdue() {

  const [transactions, setTransactions] =
    useState([]);

  useEffect(() => {

    async function loadData() {

      const { data, error } =
        await getTransactions();

      if (error) {
        console.error(error);
        return;
      }

      setTransactions(data || []);
    }

    loadData();

  }, []);

  const today = new Date();

  const overdueLoans =
    transactions.filter((t) => {

      if (
        t.status !== "Borrowed"
      ) {
        return false;
      }

      return (
        new Date(t.due_date) < today
      );
    });

  async function handleSendReminder(transaction) 
  {

  try {

    const response =
      await fetch(
        "/api/sendReminder",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            borrowerName:
              transaction.borrowers?.full_name,

            borrowerEmail:
              transaction.borrowers?.email,

            bookTitle:
              transaction.books?.title,

            dueDate:
              transaction.due_date

          })

        }
      );

    const result =
      await response.json();

    if (!response.ok) {

      alert(
        result.message ||
        "Email未成功送出"
      );

      return;
    }

    alert(
      "提醒信件已成功送出"
    );

  } catch (error) {

    console.error(error);

    alert(
      "Unexpected error occurred."
    );

  }

}





  return (

    <div>

      <h2>⏰ Overdue Books</h2>

      {overdueLoans.length === 0 ? (

        <p>No overdue books.</p>

      ) : (

        overdueLoans.map((t) => {

          const daysOverdue =
            Math.floor(
              (today - new Date(t.due_date))
              /
              (1000 * 60 * 60 * 24)
            );

          return (

            <div
              key={t.id}
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                marginBottom: "10px",
                borderRadius: "8px",
                backgroundColor: "#fff5f5"
              }}
            >

              <strong>
                {t.books?.title}
              </strong>

              <br />

              Borrower:
              {" "}
              {t.borrowers?.full_name}

              <br />

              到期日期:
              {" "}
              {t.due_date}

              <br />
              <br />
              <button
                onClick={() =>
                  handleSendReminder(t)
                }
              >
                發送提醒
              </button>

              逾期天數:
              {" "}
              {daysOverdue}

            </div>

          );

        })

      )}

    </div>

  );
}

export default Overdue;