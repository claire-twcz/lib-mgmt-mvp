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

              Due Date:
              {" "}
              {t.due_date}

              <br />

              Days Overdue:
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