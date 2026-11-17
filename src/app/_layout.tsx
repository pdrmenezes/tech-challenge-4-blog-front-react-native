import { Header } from "@/components/header";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { UserProvider } from "../contexts/user-context";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <Stack
          screenOptions={{
            header: (props) => <Header {...props} />,
            gestureEnabled: true,
            fullScreenGestureEnabled: true,
          }}
        >
          <Stack.Screen name="index" options={{ title: "Blog" }} />
          <Stack.Screen name="login" options={{ title: "Login" }} />
          <Stack.Screen name="posts/new" options={{ title: "Novo post" }} />
          <Stack.Screen name="posts" options={{ title: "Gerenciar posts" }} />
          <Stack.Screen
            name="students"
            options={{ title: "Gerenciar estudantes" }}
          />
          <Stack.Screen
            name="teachers"
            options={{ title: "Gerenciar professores" }}
          />
          <Stack.Screen name="posts/[id]" options={{ title: "Post" }} />
        </Stack>
      </UserProvider>
    </GestureHandlerRootView>
  );
}
