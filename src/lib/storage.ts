import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const AUTH_KEY = "blog_auth";

export async function getAuth() {
  if (Platform.OS === "web") {
    return localStorage.getItem(AUTH_KEY);
  }
  return await SecureStore.getItemAsync(AUTH_KEY);
}

export async function setAuth(value: string) {
  if (Platform.OS === "web") {
    localStorage.setItem(AUTH_KEY, value);
    return;
  }
  return await SecureStore.setItemAsync(AUTH_KEY, value);
}

export async function removeAuth() {
  if (Platform.OS === "web") {
    localStorage.removeItem(AUTH_KEY);
    return;
  }
  return await SecureStore.deleteItemAsync(AUTH_KEY);
}
