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

  const [bookSearchTerm, setBookSearchTerm] = useState("");
  const [selectedBookObject, setSelectedBookObject] = useState(null);

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
        (30 * 24 * 60 * 60 * 1000)
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
    setSelectedBookObject(null);
    setSelectedBorrower("");
    setBookSearchTerm("");

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

  const filteredBooksForBorrow =
  books.filter((book) => {

    const search =
      bookSearchTerm.toLowerCase();

    const title =
      book.title
        ?.toLowerCase() || "";

    const author =
      book.author
        ?.toLowerCase() || "";

    const isbn =
      book.isbn
        ?.toLowerCase() || "";

    const publisher =
      book.publisher
        ?.toLowerCase() || "";

    return (
      title.includes(search) ||
      author.includes(search) ||
      isbn.includes(search) ||
      publisher.includes(search)
    );
  });


  //Button style
  const primaryButton = {
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "6px",
  cursor: "pointer"
};

  const disabledButton = {
  backgroundColor: "#9ca3af",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "6px",
  cursor: "not-allowed"
};



  return (

    <div
      style={{
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "20px"
      }}
    >

      <p>
        Active Loans: {
          transactions.filter(
            t => t.status === "Borrowed"
          ).length
        }
      </p>

      <h3>Search Book</h3>

      <input
        type="text"
        placeholder="Search by book code, title, author, ISBN, or publisher..."
        value={bookSearchTerm}
        onChange={(e) =>
          setBookSearchTerm(e.target.value)
        }
        style={{
          width: "500px",
          padding: "8px",
          marginBottom: "12px"
        }}
      />

        {bookSearchTerm && (

  <div
    style={{
      border: "1px solid #ddd",
      padding: "12px",
      borderRadius: "8px",
      marginBottom: "20px",
      backgroundColor: "#fafafa"
    }}
  >

    <h4>Matching Books</h4>

    {filteredBooksForBorrow.length === 0 ? (

      <p>No matching books found.</p>

    ) : (

      filteredBooksForBorrow
        .slice(0, 10)
        .map((book) => (

          <div
            key={book.id}
            style={{
              borderBottom: "1px solid #eee",
              padding: "10px 0"
            }}
          >

            <strong>
              {book.book_code}
            </strong>

            {" - "}

            {book.title}

            <br />

            <span>
              Author: {book.author || "N/A"}
            </span>

            <br />

            <span>
              Available: {book.available_quantity}
            </span>

            <br />

            <button
              onClick={() => {
                setSelectedBook(book.id);
                setSelectedBookObject(book);
                setBookSearchTerm("");
              }}
              disabled={book.available_quantity <= 0}
              style={
                book.available_quantity <= 0
                  ? disabledButton
                  : primaryButton
              }
>
              {book.available_quantity <= 0
                ? "Not Available"
                : "Select This Book"}
</button>

          </div>

        ))

    )}

  </div>

)}

   {selectedBookObject && (

  <div
    style={{
      border: "1px solid #bfdbfe",
      padding: "12px",
      borderRadius: "8px",
      backgroundColor: "#eff6ff",
      marginBottom: "20px"
    }}
  >

    <h4>Selected Book</h4>

    <p>
      <strong>
        {selectedBookObject.book_code}
      </strong>

      {" - "}

      {selectedBookObject.title}
    </p>

    <p>
      Author: {selectedBookObject.author || "N/A"}
    </p>

    <p>
      Available Quantity: {selectedBookObject.available_quantity}
    </p>

    <button
      onClick={() => {
        setSelectedBook("");
        setSelectedBookObject(null);
      }}
    >
      Clear Selection
    </button>

  </div>

)}   


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
        style={primaryButton}
      >
        Borrow Book
      </button>

      <hr />

      <h3>借出中</h3>

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
              onClick={() => handleReturn(transaction)}
              style={primaryButton}
            >
              Return Book
            </button>

          </div>

        ))}

    </div>

  );
}

export default Transactions;