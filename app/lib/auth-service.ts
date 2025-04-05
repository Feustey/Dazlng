import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  generateToken,
  generateVerificationCode,
  getSessionExpiry,
} from "./auth";

const prisma = new PrismaClient();

export async function createUser(
  email: string,
  password: string,
  name?: string
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });
}

export async function verifyUser(email: string, code: string) {
  const verificationCode = await prisma.verificationCode.findFirst({
    where: {
      email,
      code,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!verificationCode) {
    throw new Error("Code de vérification invalide ou expiré");
  }

  await prisma.verificationCode.delete({
    where: {
      id: verificationCode.id,
    },
  });

  return true;
}

export async function createSession(email: string) {
  const sessionId = generateToken(email);
  const expiresAt = getSessionExpiry();

  return prisma.session.create({
    data: {
      sessionId,
      email,
      expiresAt,
    },
  });
}

export async function getSession(sessionId: string) {
  return prisma.session.findUnique({
    where: {
      sessionId,
    },
  });
}

export async function deleteSession(sessionId: string) {
  return prisma.session.delete({
    where: {
      sessionId,
    },
  });
}

export async function createVerificationCode(email: string) {
  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  await prisma.verificationCode.create({
    data: {
      email,
      code,
      expiresAt,
    },
  });

  // Au lieu d'envoyer l'email directement, nous retournons le code
  // L'envoi de l'email sera géré par la route API
  return code;
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function validatePassword(user: any, password: string) {
  return bcrypt.compare(password, user.password);
}
