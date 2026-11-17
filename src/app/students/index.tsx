import { router } from "expo-router";
import { Pencil, Trash, UserRoundPlus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useUser } from "../../contexts/user-context";
import { deleteStudent, listStudents } from "../../lib/api";
import type { Student } from "../../types/people";

export default function AdminStudentsScreen() {
  const { user, loading } = useUser();
  const [items, setItems] = useState<Student[]>([]);

  useEffect(() => {
    if (loading) return;
    if (!user || (user.role !== "docente" && user.role !== "admin")) {
      router.replace("/login");
      return;
    }
    listStudents().then(setItems);
  }, [loading, user]);

  if (loading || !user || (user.role !== "docente" && user.role !== "admin")) {
    return null;
  }

  return (
    <View style={styles.content}>
      <View style={styles.headerRow}>
        <Pressable
          style={styles.button}
          onPress={() => router.push("/students/new")}
        >
          <UserRoundPlus size={20} strokeWidth={2.5} color="#fff" />
        </Pressable>
      </View>

      <FlatList
        contentContainerStyle={styles.list}
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>
                {item.email} · {item.handle}
              </Text>
            </View>
            <View style={styles.actions}>
              <Pressable
                style={styles.iconBtn}
                onPress={() => router.push(`/students/${item.id}/edit`)}
              >
                <Pencil size={16} strokeWidth={2.5} />
              </Pressable>
              <Pressable
                style={[styles.iconBtn, { backgroundColor: "#fdd" }]}
                onPress={async () => {
                  await deleteStudent(item.id);
                  setItems((prev) => prev.filter((x) => x.id !== item.id));
                }}
              >
                <Trash size={16} strokeWidth={2.5} color="#900" />
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum aluno cadastrado.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, padding: 16 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#208AEF",
    padding: 10,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  list: { paddingBottom: 16 },
  card: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  name: { fontSize: 16, fontWeight: "600" },
  meta: { color: "#888", fontSize: 12, marginTop: 4 },
  actions: { flexDirection: "row", gap: 6 },
  iconBtn: {
    backgroundColor: "#eee",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  empty: { padding: 16, color: "#888", textAlign: "center" },
});
