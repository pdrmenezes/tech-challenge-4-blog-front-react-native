import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { deleteStudent, listStudents } from "../../lib/api";
import { useUser } from "../../contexts/user-context";
import type { Student } from "../../types/people";

export default function StudentsScreen() {
  const { user, loading } = useUser();
  const [items, setItems] = useState<Student[]>([]);

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "docente") {
      router.replace("/login");
      return;
    }
    listStudents().then(setItems);
  }, [loading, user]);

  if (loading || !user || user.role !== "docente") return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Alunos</Text>
        <Pressable style={styles.button} onPress={() => router.push("/students/new")}>
          <Text style={styles.buttonText}>Novo</Text>
        </Pressable>
      </View>
      <FlatList
        data={items}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>{item.email} · {item.course}</Text>
            <View style={styles.actions}>
              <Pressable style={styles.iconBtn} onPress={() => router.push(`/students/${item.id}/edit`)}>
                <Text>Editar</Text>
              </Pressable>
              <Pressable style={[styles.iconBtn, { backgroundColor: "#fdd" }]} onPress={async () => {
                await deleteStudent(item.id);
                setItems((prev) => prev.filter((x) => x.id !== item.id));
              }}>
                <Text>Excluir</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text>Nenhum aluno cadastrado.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  title: { fontSize: 22, fontWeight: "700" },
  button: { backgroundColor: "#208AEF", padding: 10, borderRadius: 8 },
  buttonText: { color: "#fff" },
  card: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, marginBottom: 10 },
  name: { fontSize: 16, fontWeight: "600" },
  meta: { color: "#888", fontSize: 12, marginTop: 4 },
  actions: { flexDirection: "row", gap: 6, marginTop: 8 },
  iconBtn: { backgroundColor: "#eee", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
});