import { Platform } from "react-native";

let SecureStore: any = null;
if (Platform.OS !== "web") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  SecureStore = require("expo-secure-store");
}

const AUTH_KEY = "blog_auth";

export async function getAuth() {
  if (Platform.OS === "web") {
    return localStorage.getItem(AUTH_KEY);
  }
  return SecureStore.getItemAsync(AUTH_KEY);
}

export async function setAuth(value: string) {
  if (Platform.OS === "web") {
    localStorage.setItem(AUTH_KEY, value);
    return;
  }
  await SecureStore.setItemAsync(AUTH_KEY, value);
}

export async function removeAuth() {
  if (Platform.OS === "web") {
    localStorage.removeItem(AUTH_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(AUTH_KEY);
}

export { AUTH_KEY };