import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useUser } from "../contexts/user-context";

export default function LoginScreen() {
  const { user, loading, login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [loading, user]);

  async function handleSubmit() {
    setError("");
    const ok = await login(email, password);
    if (!ok) {
      setError("Email ou senha inválidos.");
      return;
    }
    router.replace("/");
  }

  return (
    <View style={styles.form}>
      <Text style={styles.title}>Boas vindas de volta</Text>
      <Text style={styles.subtitle}>Faça login para continuar</Text>

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
        Contas para teste:
        <Text style={styles.accounts}>ana@docente.com / prof1</Text>
        <Text style={styles.accounts}>maria@discente.com / discente1</Text>
        <Text style={styles.accounts}>admin@admin.com / admin123</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 26, fontWeight: "700", color: "#111", marginBottom: 6 },
  subtitle: { fontSize: 15, color: "#666", marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
    fontSize: 15,
  },
  button: {
    backgroundColor: "#208AEF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  error: { color: "#d32f2f", marginBottom: 12, fontSize: 13 },
  hint: {
    display: "flex",
    flexDirection: "column",
    color: "#666",
    fontSize: 12,
    marginTop: 16,
  },
  accounts: {
    marginLeft: 8,
    color: "#208AEF",
    fontSize: 12,
  },
});
