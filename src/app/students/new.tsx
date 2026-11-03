import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { createStudent } from "../../lib/api";
import { useUser } from "../../contexts/user-context";

export default function NewStudentScreen() {
  const { user, loading } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [error, setError] = useState("");

  if (loading) return null;
  if (!user || user.role !== "docente") {
    router.replace("/login");
    return null;
  }

  async function handleSubmit() {
    if (!name.trim() || !email.trim()) {
      setError("Preencha nome e email.");
      return;
    }
    await createStudent({ name: name.trim(), email: email.trim(), course: course.trim() });
    router.back();
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Novo aluno</Text>
      <TextInput style={styles.input} placeholder="Nome" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Curso" value={course} onChangeText={setCourse} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Salvar</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 10 },
  button: { backgroundColor: "#208AEF", padding: 12, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600" },
  error: { color: "red", marginBottom: 8 },
});