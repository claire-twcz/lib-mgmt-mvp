import { supabase } from "./supabaseClient";

/*
Read all borrowers
Sort by full_name
Return result
*/
export async function getBorrowers() {
  return await supabase
    .from("borrowers")
    .select("*")
    .order("full_name");
}
/* Insert new borrower */ 

export async function addBorrower(borrower) {
  return await supabase
    .from("borrowers")
    .insert([borrower]);
}

export async function updateBorrower(id, borrower) {
  return await supabase
    .from("borrowers")
    .update(borrower)
    .eq("id", id);
}
/* Delete borrower */ 

export async function deleteBorrower(id) {
  return await supabase
    .from("borrowers")
    .delete()
    .eq("id", id);
}