import { useState, useEffect } from "react";

import {
  getBooks,
  updateAvailableQuantity
} from "../services/bookService";

import {
  getBorrowers
} from "../services/borrowerService";

import {
  borrowBook,
  getTransactions,
  returnBook
} from "../services/transactionService";

function Transactions() {

  const [books, setBooks] = useState([]);
  const [borrowers, setBorrowers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [selectedBook, setSelectedBook] = useState("");
  const [selectedBorrower, setSelectedBorrower] = useState("");

  async function loadBooks() {

    const { data, error } =
      await getBooks();

    if (error) {
      console.error(error);
      return;
    }

    setBooks(data);
  }

  async function loadBorrowers() {

    const { data, error } =
      await getBorrowers();

    if (error) {
      console.error(error);
      return;
    }

    setBorrowers(data);
  }

  async function loadTransactions() {

    const { data, error } =
      await getTransactions();

    if (error) {
      console.error(error);
      return;
    }

    setTransactions(data);
  }

  async function handleBorrow() {

    if (
      !selectedBook ||
      !selectedBorrower
    ) {
      alert(
        "Please select a book and borrower."
      );
      return;
    }

    const book =
      books.find(
        b => b.id === selectedBook
      );

    if (!book) {
      alert("Book not found.");
      return;
    }

    if (
      book.available_quantity <= 0
    ) {
      alert(
        "Book is not available."
      );
      return;
    }

    const borrowDate =
      new Date()
        .toISOString()
        .split("T")[0];

    const dueDate =
      new Date(
        Date.now() +
        (14 * 24 * 60 * 60 * 1000)
      )
        .toISOString()
        .split("T")[0];

    const { error } =
      await borrowBook({

        book_id: selectedBook,

        borrower_id:
          selectedBorrower,

        borrow_date:
          borrowDate,

        due_date:
          dueDate,

        status:
          "Borrowed"

      });

    if (error) {
      console.error(error);
      alert(
        "Failed to borrow book."
      );
      return;
    }

    await updateAvailableQuantity(

      selectedBook,

      book.available_quantity - 1

    );

    await loadBooks();
    await loadTransactions();

    setSelectedBook("");
    setSelectedBorrower("");

    alert("Book borrowed!");
  }

  async function handleReturn(
    transaction
  ) {

    const today =
      new Date()
        .toISOString()
        .split("T")[0];

    const { error } =
      await returnBook(
        transaction.id,
        today
      );

    if (error) {
      console.error(error);
      return;
    }

    const book =
      books.find(
        b =>
          b.id === transaction.book_id
      );

    if (!book) {
      alert("Book not found.");
      return;
    }

    await updateAvailableQuantity(

      book.id,

      book.available_quantity + 1

    );

    await loadBooks();
    await loadTransactions();
  }

  useEffect(() => {

    loadBooks();
    loadBorrowers();
    loadTransactions();

  }, []);

  return (

    <div>

      <h2>Transactions Module</h2>

      <p>
        Active Loans: {
          transactions.filter(
            t => t.status === "Borrowed"
          ).length
        }
      </p>

      <h3>Select Book</h3>

      <select
        value={selectedBook}
        onChange={(e) =>
          setSelectedBook(
            e.target.value
          )
        }
      >
        <option value="">
          Select Book
        </option>

        {books.map((book) => (

          <option
            key={book.id}
            value={book.id}
          >
            {book.book_code} - {book.title}
          </option>

        ))}
      </select>

      <br />
      <br />

      <h3>Select Borrower</h3>

      <select
        value={selectedBorrower}
        onChange={(e) =>
          setSelectedBorrower(
            e.target.value
          )
        }
      >
        <option value="">
          Select Borrower
        </option>

        {borrowers.map((borrower) => (

          <option
            key={borrower.id}
            value={borrower.id}
          >
            {borrower.full_name}
          </option>

        ))}
      </select>

      <br />
      <br />

      <button
        onClick={handleBorrow}
      >
        Borrow Book
      </button>

      <hr />

      <h3>Current Loans</h3>

      {transactions
        .filter(
          transaction =>
            transaction.status === "Borrowed"
        )
        .map((transaction) => (

          <div
            key={transaction.id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px"
            }}
          >

            <strong>
              {transaction.books?.book_code}
            </strong>

            {" - "}

            {transaction.books?.title}

            <br />

            Borrower:

            {" "}

            {transaction.borrowers?.full_name}

            <br />

            Borrow Date:

            {" "}

            {transaction.borrow_date}

            <br />

            Due Date:

            {" "}

            {transaction.due_date}

            <br />
            <br />

            <button
              onClick={() =>
                handleReturn(
                  transaction
                )
              }
            >
              Return Book
            </button>

          </div>

        ))}

    </div>

  );
}

export default Transactions;