import { supabase } from "./supabaseClient";

export async function getTransactions() {

  return await supabase
    .from("transactions")
    .select(`
      *,
      books(title),
      borrowers(full_name)
    `)
    .order("borrow_date", {
      ascending: false
    });

}

export async function borrowBook(
  transaction
) {

  return await supabase
    .from("transactions")
    .insert([transaction]);

}

export async function returnBook(
  id,
  returnDate
) {

  return await supabase
    .from("transactions")
    .update({
      return_date: returnDate,
      status: "Returned"
    })
    .eq("id", id);

}