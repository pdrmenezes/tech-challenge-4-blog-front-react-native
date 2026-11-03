import { Stack } from "expo-router";
import { UserProvider } from "../contexts/user-context";

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: true }} />
    </UserProvider>
  );
}