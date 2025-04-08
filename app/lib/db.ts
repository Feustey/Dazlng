import mongoose from "mongoose";
import { connectToDatabase } from "./mongodb";

export { connectToDatabase };

export async function getDb() {
  const conn = await connectToDatabase();
  return conn.db;
}

export async function closeDb() {
  await mongoose.connection.close();
}

export default {
  getDb,
  closeDb,
};
