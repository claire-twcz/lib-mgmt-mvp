import { useEffect, useState } from "react";

import {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
} from "../services/bookService";

function Books() {
  /*
    books
    -----
    This stores all book records loaded from Supabase.
  */
  const [books, setBooks] = useState([]);

  /*
    searchTerm
    ----------
    This stores what the user types in the search box.
  */
  const [searchTerm, setSearchTerm] = useState("");

  /*
    Add Book Form Fields
    --------------------
    These store values typed by the admin in the Add Book form.
  */
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [category, setCategory] = useState("");
  const [totalQuantity, setTotalQuantity] = useState(1);

  /*
    loadBooks()
    -----------
    This function reads books from Supabase and puts them into React state.

    We created it as a reusable function because we need to reload books after:
    - adding a book
    - editing a book
    - deleting a book
  */
  async function loadBooks() {
    const { data, error } = await getBooks();

    if (error) {
      console.error("Error loading books:", error);
      return;
    }

    setBooks(data);
  }

  /*
    useEffect()
    -----------
    This runs automatically when the Books page first opens.

    It loads the existing books from Supabase.
  */
  useEffect(() => {
    loadBooks();
  }, []);

  /*
    filteredBooks
    -------------
    This creates a filtered list based on the search box.

    If searchTerm is empty, it shows all books.
    If user types "clean", it shows books where title/author/isbn/category contains "clean".
  */
  const filteredBooks = books.filter((book) => {
    const search = searchTerm.toLowerCase();

    const titleMatch = book.title
      ?.toLowerCase()
      .includes(search);

    const authorMatch = book.author
      ?.toLowerCase()
      .includes(search);

    const isbnMatch = book.isbn
      ?.toLowerCase()
      .includes(search);

    const categoryMatch = book.category
      ?.toLowerCase()
      .includes(search);

    return titleMatch || authorMatch || isbnMatch || categoryMatch;
  });

  /*
    handleAddBook()
    ---------------
    This function runs when the admin clicks "Add Book".

    It:
    1. Validates basic input
    2. Inserts the new book into Supabase
    3. Clears the form
    4. Reloads the book list
  */
  async function handleAddBook() {
    if (!title.trim()) {
      alert("Please enter a book title.");
      return;
    }

    const quantityNumber = Number(totalQuantity);

    if (quantityNumber <= 0) {
      alert("Total quantity must be at least 1.");
      return;
    }

    const newBook = {
      title: title.trim(),
      author: author.trim(),
      isbn: isbn.trim(),
      category: category.trim(),
      total_quantity: quantityNumber,
      available_quantity: quantityNumber,
    };

    const { error } = await addBook(newBook);

    if (error) {
      console.error("Error adding book:", error);
      alert("Failed to add book. Please check console.");
      return;
    }

    /*
      Clear form after successful insert.
    */
    setTitle("");
    setAuthor("");
    setIsbn("");
    setCategory("");
    setTotalQuantity(1);

    /*
      Reload books from Supabase so the new book appears immediately.
    */
    loadBooks();
  }

  /*
    handleEditBook(book)
    --------------------
    This function uses simple browser prompts for MVP editing.

    Later, we can replace this with a proper edit form/modal.
  */
  async function handleEditBook(book) {
    const newTitle = prompt("Edit title:", book.title);
    if (newTitle === null) return;

    const newAuthor = prompt("Edit author:", book.author || "");
    if (newAuthor === null) return;

    const newCategory = prompt("Edit category:", book.category || "");
    if (newCategory === null) return;

    const newTotalQuantity = prompt(
      "Edit total quantity:",
      book.total_quantity
    );
    if (newTotalQuantity === null) return;

    const quantityNumber = Number(newTotalQuantity);

    if (quantityNumber <= 0) {
      alert("Total quantity must be at least 1.");
      return;
    }

    /*
      Simple MVP rule:
      We update total_quantity only.
      For available_quantity, we should be careful later because borrowed books affect availability.

      For now, because this is Day 2 and no borrowing process exists yet,
      we can also update available_quantity to the same number.
    */
    const updatedBook = {
      title: newTitle.trim(),
      author: newAuthor.trim(),
      category: newCategory.trim(),
      total_quantity: quantityNumber,
      available_quantity: quantityNumber,
    };

    const { error } = await updateBook(book.id, updatedBook);

    if (error) {
      console.error("Error updating book:", error);
      alert("Failed to update book. Please check console.");
      return;
    }

    loadBooks();
  }

  /*
    handleDeleteBook(id)
    --------------------
    This function deletes one book.

    It asks for confirmation first to avoid accidental deletion.
  */
  async function handleDeleteBook(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) {
      return;
    }

    const { error } = await deleteBook(id);

    if (error) {
      console.error("Error deleting book:", error);
      alert("Failed to delete book. Please check console.");
      return;
    }

    loadBooks();
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Books Module</h2>

      <p>
        This page allows the admin to manage the library book inventory.
      </p>

      {/* ---------------- Add Book Form ---------------- */}

      <section
        style={{
          border: "1px solid #ccc",
          padding: "16px",
          marginBottom: "24px",
          borderRadius: "8px",
        }}
      >
        <h3>Add Book</h3>

        <div style={{ marginBottom: "10px" }}>
          <label>Title</label>
          <br />
          <input
            type="text"
            placeholder="Example: Clean Code"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "300px", padding: "6px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Author</label>
          <br />
          <input
            type="text"
            placeholder="Example: Robert C Martin"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            style={{ width: "300px", padding: "6px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>ISBN</label>
          <br />
          <input
            type="text"
            placeholder="Example: 9780132350884"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            style={{ width: "300px", padding: "6px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Category</label>
          <br />
          <input
            type="text"
            placeholder="Example: Software"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: "300px", padding: "6px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Total Quantity</label>
          <br />
          <input
            type="number"
            min="1"
            value={totalQuantity}
            onChange={(e) => setTotalQuantity(e.target.value)}
            style={{ width: "300px", padding: "6px" }}
          />
        </div>

        <button onClick={handleAddBook}>
          Add Book
        </button>
      </section>

      {/* ---------------- Search Box ---------------- */}

      <section style={{ marginBottom: "20px" }}>
        <h3>Book List</h3>

        <input
          type="text"
          placeholder="Search by title, author, ISBN, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "400px",
            padding: "8px",
            marginBottom: "16px",
          }}
        />
      </section>

      {/* ---------------- Book List ---------------- */}

      <section>
        {filteredBooks.length === 0 ? (
          <p>No books found.</p>
        ) : (
          filteredBooks.map((book) => (
            <div
              key={book.id}
              style={{
                border: "1px solid #ddd",
                padding: "14px",
                marginBottom: "12px",
                borderRadius: "8px",
                backgroundColor: "#fafafa",
              }}
            >
              <h4 style={{ margin: "0 0 8px 0" }}>
                {book.title}
              </h4>

              <p style={{ margin: "4px 0" }}>
                <strong>Author:</strong> {book.author || "N/A"}
              </p>

              <p style={{ margin: "4px 0" }}>
                <strong>ISBN:</strong> {book.isbn || "N/A"}
              </p>

              <p style={{ margin: "4px 0" }}>
                <strong>Category:</strong> {book.category || "N/A"}
              </p>

              <p style={{ margin: "4px 0" }}>
                <strong>Total Quantity:</strong> {book.total_quantity}
              </p>

              <p style={{ margin: "4px 0" }}>
                <strong>Available Quantity:</strong> {book.available_quantity}
              </p>

              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() => handleEditBook(book)}
                  style={{ marginRight: "8px" }}
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDeleteBook(book.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default Books;