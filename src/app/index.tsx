import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { listPosts, searchPosts } from "../lib/api";
import { useUser } from "../contexts/user-context";
import type { Post } from "../types/posts";

export default function HomeScreen() {
  const { user, loading, logout } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user]);

  useEffect(() => {
    if (!user) return;
    listPosts().then((p) => setPosts(p.filter((x) => x.status === "publicado")));
  }, [user]);

  async function handleSearch() {
    const res = await searchPosts({ q: query });
    setPosts(res.filter((x) => x.status === "publicado"));
  }

  if (loading || !user) return null;

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
        <Text style={{ fontWeight: "600" }}>{user.email}</Text>
        <Pressable onPress={() => { logout(); router.replace("/login"); }}>
          <Text style={{ color: "#208AEF" }}>Sair</Text>
        </Pressable>
      </View>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Buscar posts..."
          value={query}
          onChangeText={setQuery}
        />
        <Pressable style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Buscar</Text>
        </Pressable>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => router.push(`/posts/${item.id}`)}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.content.slice(0, 100)}...</Text>
            <Text style={styles.meta}>
              Por {item.author} em {new Date(item.created_at).toLocaleDateString("pt-BR")}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text>Nenhum post publicado.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  searchRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10 },
  button: { backgroundColor: "#208AEF", paddingHorizontal: 16, borderRadius: 8, justifyContent: "center" },
  buttonText: { color: "#fff" },
  card: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, marginBottom: 10 },
  title: { fontSize: 18, fontWeight: "600" },
  desc: { color: "#555", marginTop: 4 },
  meta: { color: "#888", fontSize: 12, marginTop: 6 },
});