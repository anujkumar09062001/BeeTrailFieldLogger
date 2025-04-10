import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ZustandStorage<T> {
  getItem: (name: string) => Promise<T | null>;
  setItem: (name: string, value: T) => Promise<void>;
  removeItem: (name: string) => Promise<void>;
}

export const asyncStorage: ZustandStorage<any> = {
  setItem: async (key, value) => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },
  getItem: async (key) => {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },
  removeItem: async (key) => {
    await AsyncStorage.removeItem(key);
  },
};
