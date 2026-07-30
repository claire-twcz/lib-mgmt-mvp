import { useState, useEffect } from "react";

import { getBooks } from "../services/bookService";
import { getBorrowers } from "../services/borrowerService";
import { getTransactions } from "../services/transactionService";

function Dashboard() {
  const [books, setBooks] = useState([]);
  const [borrowers, setBorrowers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  async function loadBooks() {
    const { data } = await getBooks();
    setBooks(data || []);
  }

  async function loadBorrowers() {
    const { data } = await getBorrowers();
    setBorrowers(data || []);
  }

  async function loadTransactions() {
    const { data } = await getTransactions();
    setTransactions(data || []);
  }

  useEffect(() => {
    loadBooks();
    loadBorrowers();
    loadTransactions();
  }, []);

  const totalBooks = books.length;
  const totalBorrowers = borrowers.length;

  const activeLoans = transactions.filter((t) => t.status === "Borrowed").length;

  const today = new Date();

  const overdueBooks = transactions.filter((t) => {
    if (t.status !== "Borrowed") return false;

    return new Date(t.due_date) < today;
  }).length;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
      <div>
        <h2>Dashboard Page</h2>
        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "10px",
            minWidth: "180px",
          }}
        >
          <h3>📚 Total Books</h3>
          <h1>{totalBooks}</h1>
        </div>
      </div>

      <div>
        <h2>Dashboard Page</h2>
        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "10px",
            minWidth: "180px",
          }}
        >
          <h3>👥 Borrowers</h3>
          <h1>{totalBorrowers}</h1>
        </div>
      </div>

      <div>
        <h2>Dashboard Page</h2>
        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "10px",
            minWidth: "180px",
          }}
        >
          <h3>🔄 Active Loans</h3>
          <h1>{activeLoans}</h1>
        </div>
      </div>

      <div>
        <h2>Dashboard Page</h2>
        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "10px",
            minWidth: "180px",
          }}
        >
          <h3>⏰Overdue Books</h3>
          <h1>{overdueBooks}</h1>
        </div>

        <h2>Recent Activity</h2>
        {
transactions
.slice(0, 10)
.map((t) => (

  <div key={t.id}>

    {t.borrowers?.full_name}

    {" borrowed "}

    {t.books?.title}

    {" on "}

    {t.borrow_date}

  </div>

))
}


      </div>
    </div>
  );
}

export default Dashboard;