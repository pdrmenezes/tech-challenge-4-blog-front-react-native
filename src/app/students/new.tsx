import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { useUser } from "../../contexts/user-context";
import { createStudent } from "../../lib/api";

export default function NewStudentScreen() {
  const { user, loading } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [handle, setHandle] = useState("");
  const [error, setError] = useState("");

  const allowed = user?.role === "docente" || user?.role === "admin";

  useEffect(() => {
    if (!loading && (!user || !allowed)) {
      router.replace("/login");
    }
  }, [loading, user, allowed]);

  if (loading) return null;
  if (!user || !allowed) {
    return null;
  }

  async function handleSubmit() {
    if (!name.trim() || !email.trim() || !password.trim() || !handle.trim()) {
      setError("Preencha nome, email, senha e tag.");
      return;
    }
    try {
      await createStudent({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        handle: handle.trim(),
      });
      router.replace("/students");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao criar aluno.");
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: "Novo estudante" }} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
      >
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={name}
          onChangeText={setName}
        />
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
        <TextInput
          style={styles.input}
          placeholder="Tag (apelido)"
          autoCapitalize="none"
          value={handle}
          onChangeText={setHandle}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Salvar</Text>
        </Pressable>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#208AEF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  error: { color: "#d32f2f", marginBottom: 8, fontSize: 13 },
});
