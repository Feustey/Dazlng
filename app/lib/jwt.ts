import { sign, verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function createJWT(payload: any): Promise<string> {
  return sign(payload, JWT_SECRET, { expiresIn: "24h" });
}

export async function verifyJWT(token: string): Promise<any> {
  try {
    return verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
}
