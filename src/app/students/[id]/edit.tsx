import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { getStudent, updateStudent } from "../../../lib/api";
import { useUser } from "../../../contexts/user-context";
import type { Student } from "../../../types/people";

export default function EditStudentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, loading } = useUser();
  const [item, setItem] = useState<Student | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");

  useEffect(() => {
    if (!id) return;
    getStudent(Number(id)).then((s) => {
      setItem(s);
      setName(s.name);
      setEmail(s.email);
      setCourse(s.course);
    });
  }, [id]);

  if (loading) return null;
  if (!user || user.role !== "docente") {
    router.replace("/login");
    return null;
  }

  async function handleSave() {
    if (!item) return;
    await updateStudent(item.id, { name, email, course });
    router.back();
  }

  if (!item) return <Text style={{ padding: 16 }}>Carregando...</Text>;

  return (
    <ScrollView style={styles.container}>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>← Voltar</Text>
      </Pressable>
      <Text style={styles.title}>Editar aluno</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nome" />
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" />
      <TextInput style={styles.input} value={course} onChangeText={setCourse} placeholder="Curso" />
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