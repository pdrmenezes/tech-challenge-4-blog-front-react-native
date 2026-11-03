import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useUser } from "../contexts/user-context";

export default function LoginScreen() {
  const { user, loading, login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!loading && user) {
    if (user.role === "docente") router.replace("/admin/posts");
    else router.replace("/");
  }

  async function handleSubmit() {
    setError("");
    const ok = await login(email, password);
    if (!ok) {
      setError("Email ou senha inválidos.");
      return;
    }
    const role = email.endsWith("@docente.com") ? "docente" : "discente";
    router.replace(role === "docente" ? "/admin/posts" : "/");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Entrar</Text>
      </Pressable>
      <Text style={styles.hint}>
        Contas: ana@docente.com/prof1, joao@docente.com/prof2,
        maria@discente.com/discente1, pedro@discente.com/discente2
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", gap: 12 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12 },
  button: { backgroundColor: "#208AEF", padding: 12, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600" },
  error: { color: "red" },
  hint: { fontSize: 12, color: "#666", marginTop: 8 },
});