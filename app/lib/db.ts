import { supabase } from "@/utils/supabase";

export async function connectToDatabase() {
  try {
    const { data, error } = await supabase.from("config").select("*").single();

    if (error) {
      console.error("Error connecting to database:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in connectToDatabase:", error);
    throw error;
  }
}

export async function getDatabase() {
  return supabase;
}
