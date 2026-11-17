import { Image } from "expo-image";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Pencil } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useUser } from "../../contexts/user-context";
import { createComment, getPost } from "../../lib/api";
import type { Comment, Post } from "../../types/posts";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, loading } = useUser();
  const [post, setPost] = useState<Post | null>(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!id) return;
    getPost(Number(id))
      .then(setPost)
      .catch(() => setPost(null));
  }, [id]);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user]);

  if (loading || !user) return null;

  const canManage = user.role === "docente" || user.role === "admin";
  const postAllowsComments = !!post?.accepts_comments;
  const canComment =
    !!post &&
    postAllowsComments &&
    (user.role === "docente" || post.status === "publicado");

  async function handleComment() {
    if (!post) return;
    const content = comment.trim();
    if (!content) return;
    try {
      await createComment(post.id, content);
      setComment("");
      const updated = await getPost(post.id);
      setPost(updated);
    } catch (e) {
      Alert.alert(
        "Erro",
        e instanceof Error
          ? e.message
          : "Não foi possível enviar o comentário.",
      );
    }
  }

  if (!post) {
    return (
      <>
        <Stack.Screen options={{ title: "Detalhe do post" }} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Carregando...</Text>
        </View>
      </>
    );
  }

  const comments: Comment[] = post.comments ?? [];

  return (
    <>
      <Stack.Screen options={{ title: post.title }} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
      >
        {canManage && (
          <View style={styles.row}>
            <Text
              style={[
                styles.badge,
                post.status === "publicado"
                  ? styles.badgePublished
                  : post.status === "excluido"
                    ? styles.badgeDeleted
                    : styles.badgeDraft,
              ]}
            >
              {post.status}
            </Text>
            <Pressable
              style={styles.editBtn}
              onPress={() => router.push(`/posts/${post.id}/edit`)}
            >
              <Pencil size={16} strokeWidth={2.5} color="#fff" />
              <Text style={styles.editText}>Editar post</Text>
            </Pressable>
          </View>
        )}
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.meta}>
          Por {post.author} em{" "}
          {new Date(post.created_at).toLocaleDateString("pt-BR")}
        </Text>
        <Image
          source={{ uri: post.image || "" }}
          style={styles.image}
          contentFit="cover"
        />
        <Text style={styles.contentText}>{post.content}</Text>

        {postAllowsComments && (
          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>
              Comentários ({comments.length})
            </Text>
            {comments.length === 0 && (
              <Text style={styles.commentsEmpty}>Nenhum comentário ainda.</Text>
            )}
            {comments.map((c) => (
              <View key={c.id} style={styles.commentCard}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAuthor}>{c.author}</Text>
                  <Text style={styles.commentDate}>
                    {new Date(c.created_at).toLocaleDateString("pt-BR")}
                  </Text>
                </View>
                <Text style={styles.commentContent}>{c.content}</Text>
              </View>
            ))}
            {canComment && (
              <View style={styles.commentForm}>
                <TextInput
                  style={styles.input}
                  placeholder="Escreva um comentário..."
                  value={comment}
                  onChangeText={setComment}
                />
                <Pressable style={styles.button} onPress={handleComment}>
                  <Text style={styles.buttonText}>Comentar</Text>
                </Pressable>
              </View>
            )}
            {!canComment && post.status !== "publicado" && (
              <Text style={styles.commentsEmpty}>
                Este post ainda não está publicado.
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 16 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  badge: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#ccc",
  },
  badgePublished: { backgroundColor: "#4caf50", color: "#fff" },
  badgeDraft: { backgroundColor: "#ff9800", color: "#fff" },
  badgeDeleted: { backgroundColor: "#f44336", color: "#fff" },
  editBtn: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#555",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editText: { color: "#fff" },
  title: { fontSize: 24, fontWeight: "700", marginVertical: 8 },
  meta: { color: "#888", marginBottom: 12 },
  contentText: { fontSize: 16, lineHeight: 24 },
  image: { width: "100%", height: 200, marginBottom: 12 },
  commentsSection: { marginTop: 24 },
  commentsTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  commentsEmpty: { color: "#888", marginBottom: 8 },
  commentCard: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  commentAuthor: { fontWeight: "600", fontSize: 14 },
  commentDate: { color: "#888", fontSize: 12 },
  commentContent: { marginTop: 4, fontSize: 14, color: "#333" },
  commentForm: { flexDirection: "row", gap: 8, marginTop: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#208AEF",
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: { color: "#888" },
});
