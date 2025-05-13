import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  AUTH: '@auth',
  USER: '@user',
};

export const storage = {
  async setAuth(token: string) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH, token);
      return true;
    } catch (error) {
      console.error('Error saving auth token:', error);
      return false;
    }
  },

  async getAuth(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH);
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  },

  async setUser(user: any) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Error saving user:', error);
      return false;
    }
  },

  async getUser(): Promise<any | null> {
    try {
      const user = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  async clearAll() {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.AUTH, STORAGE_KEYS.USER]);
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }
}; 