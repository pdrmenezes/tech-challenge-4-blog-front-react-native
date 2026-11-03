import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { getPost } from "../../lib/api";
import { useUser } from "../../contexts/user-context";
import type { Post } from "../../types/posts";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, loading } = useUser();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (!id) return;
    getPost(Number(id)).then(setPost).catch(() => setPost(null));
  }, [id]);

  if (loading) return null;
  if (!user) {
    router.replace("/login");
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>← Voltar</Text>
      </Pressable>
      {user.role === "docente" && post && (
        <View style={styles.row}>
          <Text style={styles.badge}>{post.status}</Text>
          <Pressable
            style={styles.editBtn}
            onPress={() => router.push(`/posts/${post.id}/edit`)}
          >
            <Text style={styles.editText}>Editar post</Text>
          </Pressable>
        </View>
      )}
      <Text style={styles.title}>{post?.title}</Text>
      <Text style={styles.meta}>
        Por {post?.author} em{" "}
        {post ? new Date(post.created_at).toLocaleDateString("pt-BR") : ""}
      </Text>
      <Text style={styles.content}>{post?.content}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  back: { color: "#208AEF", marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  badge: { fontSize: 12, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, backgroundColor: "#eee" },
  editBtn: { backgroundColor: "#555", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  editText: { color: "#fff" },
  title: { fontSize: 24, fontWeight: "700", marginVertical: 8 },
  meta: { color: "#888", marginBottom: 12 },
  content: { fontSize: 16, lineHeight: 24 },
});