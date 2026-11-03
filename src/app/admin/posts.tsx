import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import {
  deletePost,
  listPosts,
  recoverPost,
  togglePostStatus,
} from "../../lib/api";
import { useUser } from "../../contexts/user-context";
import type { Post } from "../../types/posts";

export default function AdminPostsScreen() {
  const { user, loading } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "docente") {
      router.replace("/login");
      return;
    }
    listPosts().then(setPosts);
  }, [loading, user]);

  if (loading || !user || user.role !== "docente") return null;

  async function handleToggle(id: number) {
    const updated = await togglePostStatus(id);
    setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)));
  }
  async function handleDelete(id: number) {
    const updated = await deletePost(id);
    setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)));
  }
  async function handleRecover(id: number) {
    const updated = await recoverPost(id);
    setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)));
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Boas vindas, {user?.email}</Text>
        <View style={styles.row}>
          <Pressable style={styles.button} onPress={() => router.push("/posts/new")}>
            <Text style={styles.buttonText}>Novo post</Text>
          </Pressable>
          <Pressable style={styles.secondary} onPress={() => router.push("/teachers")}>
            <Text style={styles.secondaryText}>Professores</Text>
          </Pressable>
          <Pressable style={styles.secondary} onPress={() => router.push("/students")}>
            <Text style={styles.secondaryText}>Alunos</Text>
          </Pressable>
          <Pressable style={styles.secondary} onPress={() => router.push("/")}>
            <Text style={styles.secondaryText}>Ver blog</Text>
          </Pressable>
        </View>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.badge}>{item.status}</Text>
            </View>
            <Text style={styles.meta}>
              {new Date(item.created_at).toLocaleDateString("pt-BR")} ·{" "}
              {new Date(item.updated_at).toLocaleDateString("pt-BR")}
            </Text>
            <View style={styles.actions}>
              {item.status === "excluido" && (
                <Pressable style={styles.iconBtn} onPress={() => handleRecover(item.id)}>
                  <Text>Recuperar</Text>
                </Pressable>
              )}
              <Pressable style={styles.iconBtn} onPress={() => handleToggle(item.id)}>
                <Text>{item.status === "publicado" ? "Despublicar" : "Publicar"}</Text>
              </Pressable>
              <Pressable style={styles.iconBtn} onPress={() => router.push(`/posts/${item.id}/edit`)}>
                <Text>Editar</Text>
              </Pressable>
              <Pressable
                style={[styles.iconBtn, { backgroundColor: "#fdd" }]}
                onPress={() => handleDelete(item.id)}
              >
                <Text>Excluir</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text>Nenhum post cadastrado.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { marginBottom: 12 },
  welcome: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  row: { flexDirection: "row", gap: 8 },
  button: { backgroundColor: "#208AEF", padding: 10, borderRadius: 8 },
  buttonText: { color: "#fff" },
  secondary: { backgroundColor: "#555", padding: 10, borderRadius: 8 },
  secondaryText: { color: "#fff" },
  card: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, marginBottom: 10 },
  cardRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontSize: 16, fontWeight: "600", flex: 1 },
  badge: { fontSize: 12, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, backgroundColor: "#eee" },
  meta: { color: "#888", fontSize: 12, marginTop: 4 },
  actions: { flexDirection: "row", gap: 6, marginTop: 8, flexWrap: "wrap" },
  iconBtn: { backgroundColor: "#eee", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
});