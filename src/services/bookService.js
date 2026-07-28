import { supabase } from "./supabaseClient";

/*
  getBooks()
  ----------
  Purpose:
  Read all books from the "books" table in Supabase.

  This function is used when the Books page loads.
*/
export async function getBooks() {
  return await supabase
    .from("books")
    .select("*")
    .order("title", { ascending: true });
}

/*
  addBook(book)
  -------------
  Purpose:
  Insert a new book into the "books" table.

  Input example:
  {
    title: "Clean Code",
    author: "Robert C Martin",
    isbn: "9780132350884",
    category: "Software",
    total_quantity: 1,
    available_quantity: 1
  }
*/
export async function addBook(book) {
  return await supabase
    .from("books")
    .insert([book]);
}

/*
  updateBook(id, updatedBook)
  --------------------------
  Purpose:
  Update one existing book by its ID.

  Example:
  updateBook(book.id, {
    title: "New Title"
  })
*/
export async function updateBook(id, updatedBook) {
  return await supabase
    .from("books")
    .update(updatedBook)
    .eq("id", id);
}

/*
  deleteBook(id)
  --------------
  Purpose:
  Delete one book from the database by its ID.
*/
export async function deleteBook(id) {
  return await supabase
    .from("books")
    .delete()
    .eq("id", id);
}

/*Reduce available quantity*/

export async function updateAvailableQuantity(
  id,
  quantity
) {

  return await supabase
    .from("books")
    .update({
      available_quantity:
        quantity
    })
    .eq("id", id);

}