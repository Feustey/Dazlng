import { mcpService } from "./mcpService";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
}

export interface Session {
  id: string;
  userId: string;
  expires: Date;
  createdAt: Date;
}

export interface VerificationCode {
  id: string;
  userId: string;
  code: string;
  expires: Date;
  createdAt: Date;
}

export class AuthService {
  private users: Map<string, User> = new Map();
  private sessions: Map<string, Session> = new Map();
  private verificationCodes: Map<string, VerificationCode> = new Map();
  private transporter: nodemailer.Transporter;

  constructor() {
    // Initialiser le transporteur d'emails
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      secure: Number(process.env.EMAIL_SERVER_PORT) === 465,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });
  }

  // Créer un nouvel utilisateur
  async createUser(
    email: string,
    name: string,
    password: string
  ): Promise<User> {
    try {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = Array.from(this.users.values()).find(
        (user) => user.email === email
      );

      if (existingUser) {
        throw new Error("User already exists");
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Créer un nouvel utilisateur
      const user: User = {
        id: `user_${Date.now()}`,
        email,
        name,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: false,
      };

      // Stocker l'utilisateur
      this.users.set(user.id, user);

      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  // Vérifier un utilisateur
  async verifyUser(email: string, code: string): Promise<boolean> {
    try {
      // Trouver l'utilisateur
      const user = Array.from(this.users.values()).find(
        (user) => user.email === email
      );

      if (!user) {
        throw new Error("User not found");
      }

      // Trouver le code de vérification
      const verificationCode = Array.from(this.verificationCodes.values()).find(
        (vc) => vc.userId === user.id && vc.code === code
      );

      if (!verificationCode) {
        throw new Error("Invalid verification code");
      }

      // Vérifier si le code est expiré
      if (verificationCode.expires < new Date()) {
        throw new Error("Verification code expired");
      }

      // Marquer l'utilisateur comme vérifié
      user.emailVerified = true;
      user.updatedAt = new Date();
      this.users.set(user.id, user);

      // Supprimer le code de vérification
      this.verificationCodes.delete(verificationCode.id);

      return true;
    } catch (error) {
      console.error("Error verifying user:", error);
      throw error;
    }
  }

  // Créer une session
  async createSession(userId: string): Promise<Session> {
    try {
      // Vérifier si l'utilisateur existe
      const user = this.users.get(userId);

      if (!user) {
        throw new Error("User not found");
      }

      // Créer une nouvelle session
      const session: Session = {
        id: `session_${Date.now()}`,
        userId,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
        createdAt: new Date(),
      };

      // Stocker la session
      this.sessions.set(session.id, session);

      return session;
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  }

  // Obtenir une session
  async getSession(sessionId: string): Promise<Session | null> {
    try {
      // Trouver la session
      const session = this.sessions.get(sessionId);

      if (!session) {
        return null;
      }

      // Vérifier si la session est expirée
      if (session.expires < new Date()) {
        this.sessions.delete(sessionId);
        return null;
      }

      return session;
    } catch (error) {
      console.error("Error getting session:", error);
      throw error;
    }
  }

  // Supprimer une session
  async deleteSession(sessionId: string): Promise<boolean> {
    try {
      // Vérifier si la session existe
      const session = this.sessions.get(sessionId);

      if (!session) {
        return false;
      }

      // Supprimer la session
      this.sessions.delete(sessionId);

      return true;
    } catch (error) {
      console.error("Error deleting session:", error);
      throw error;
    }
  }

  // Créer un code de vérification
  async createVerificationCode(userId: string): Promise<VerificationCode> {
    try {
      // Vérifier si l'utilisateur existe
      const user = this.users.get(userId);

      if (!user) {
        throw new Error("User not found");
      }

      // Générer un code de vérification
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      // Créer un nouveau code de vérification
      const verificationCode: VerificationCode = {
        id: `vc_${Date.now()}`,
        userId,
        code,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 heures
        createdAt: new Date(),
      };

      // Stocker le code de vérification
      this.verificationCodes.set(verificationCode.id, verificationCode);

      // Envoyer l'email de vérification
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Vérification de votre compte",
        text: `Votre code de vérification est: ${code}`,
        html: `<p>Votre code de vérification est: <strong>${code}</strong></p>`,
      });

      return verificationCode;
    } catch (error) {
      console.error("Error creating verification code:", error);
      throw error;
    }
  }

  // Obtenir un utilisateur
  async getUser(userId: string): Promise<User | null> {
    try {
      // Trouver l'utilisateur
      const user = this.users.get(userId);

      if (!user) {
        return null;
      }

      return user;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  }

  // Générer un token JWT
  generateToken(user: User): string {
    return jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );
  }

  // Vérifier un token JWT
  verifyToken(token: string): any {
    return jwt.verify(token, process.env.JWT_SECRET || "secret");
  }
}

export const authService = new AuthService();
