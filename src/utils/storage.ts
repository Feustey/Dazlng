import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from './logger';

interface Storage {
  getUser(): Promise<User | null>;
  setUser(user: User): Promise<void>;
  getAuth(): Promise<Auth | null>;
  setAuth(auth: Auth): Promise<void>;
  clear(): Promise<void>;
}

interface User {
  id: string;
  email: string;
  name: string;
}

interface Auth {
  token: string;
  refreshToken: string;
}

type StorageError = Error | unknown;

class StorageService implements Storage {
  private static instance: StorageService;
  private readonly USER_KEY = '@user';
  private readonly AUTH_KEY = '@auth';

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  async getUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(this.USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error: StorageError) {
      logger.error('Error getting user from storage:', error);
      return null;
    }
  }

  async setUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } catch (error: StorageError) {
      logger.error('Error setting user in storage:', error);
    }
  }

  async getAuth(): Promise<Auth | null> {
    try {
      const authJson = await AsyncStorage.getItem(this.AUTH_KEY);
      return authJson ? JSON.parse(authJson) : null;
    } catch (error: StorageError) {
      logger.error('Error getting auth from storage:', error);
      return null;
    }
  }

  async setAuth(auth: Auth): Promise<void> {
    try {
      await AsyncStorage.setItem(this.AUTH_KEY, JSON.stringify(auth));
    } catch (error: StorageError) {
      logger.error('Error setting auth in storage:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error: StorageError) {
      logger.error('Error clearing storage:', error);
    }
  }
}

export const storage = StorageService.getInstance(); 