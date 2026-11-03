import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { getTeacher, updateTeacher } from "../../../lib/api";
import { useUser } from "../../../contexts/user-context";
import type { Teacher } from "../../../types/people";

export default function EditTeacherScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, loading } = useUser();
  const [item, setItem] = useState<Teacher | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");

  useEffect(() => {
    if (!id) return;
    getTeacher(Number(id)).then((t) => {
      setItem(t);
      setName(t.name);
      setEmail(t.email);
      setSubject(t.subject);
    });
  }, [id]);

  if (loading) return null;
  if (!user || user.role !== "docente") {
    router.replace("/login");
    return null;
  }

  async function handleSave() {
    if (!item) return;
    await updateTeacher(item.id, { name, email, subject });
    router.back();
  }

  if (!item) return <Text style={{ padding: 16 }}>Carregando...</Text>;

  return (
    <ScrollView style={styles.container}>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>← Voltar</Text>
      </Pressable>
      <Text style={styles.title}>Editar professor</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nome" />
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" />
      <TextInput style={styles.input} value={subject} onChangeText={setSubject} placeholder="Disciplina" />
      <Pressable style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Salvar</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  back: { color: "#208AEF", marginBottom: 12 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 10 },
  button: { backgroundColor: "#208AEF", padding: 12, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600" },
});