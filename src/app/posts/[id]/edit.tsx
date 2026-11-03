import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { getPost, togglePostStatus, updatePost } from "../../../lib/api";
import { useUser } from "../../../contexts/user-context";
import type { Post } from "../../../types/posts";

export default function EditPostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, loading } = useUser();
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!id) return;
    getPost(Number(id)).then((p) => setPost(p));
  }, [id]);

  useEffect(() => {
    if (!post) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTitle(post.title);
    setContent(post.content);
    setAuthor(post.author);
  }, [post]);

  if (loading) return null;
  if (!user || user.role !== "docente") {
    router.replace("/login");
    return null;
  }

  async function handleSave() {
    if (!post) return;
    const updated = await updatePost(post.id, { title, content, author });
    setPost(updated);
    setMsg("Post atualizado com sucesso!");
  }

  async function handleToggle() {
    if (!post) return;
    const updated = await togglePostStatus(post.id);
    setPost(updated);
    setMsg(`Post ${updated.status === "publicado" ? "publicado" : "movido para rascunho"} com sucesso!`);
  }

  if (!post) return <Text style={{ padding: 16 }}>Carregando...</Text>;

  return (
    <ScrollView style={styles.container}>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>← Voltar</Text>
      </Pressable>
      <View style={styles.row}>
        <Text style={styles.title}>Editar post</Text>
        <Text style={styles.badge}>{post.status}</Text>
      </View>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Título" />
      <TextInput style={styles.input} value={author} onChangeText={setAuthor} placeholder="Autor" />
      <TextInput
        style={[styles.input, styles.textarea]}
        value={content}
        onChangeText={setContent}
        multiline
        placeholder="Conteúdo"
      />
      {msg ? <Text style={styles.success}>{msg}</Text> : null}
      <View style={styles.actions}>
        <Pressable style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Salvar alterações</Text>
        </Pressable>
        <Pressable style={styles.secondary} onPress={handleToggle}>
          <Text style={styles.secondaryText}>
            {post.status === "rascunho" ? "Publicar" : "Mover para rascunho"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  back: { color: "#208AEF", marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  title: { fontSize: 22, fontWeight: "700" },
  badge: { fontSize: 12, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, backgroundColor: "#eee" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 10 },
  textarea: { minHeight: 120, textAlignVertical: "top" },
  actions: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  button: { backgroundColor: "#208AEF", padding: 12, borderRadius: 8, alignItems: "center", flex: 1 },
  buttonText: { color: "#fff", fontWeight: "600" },
  secondary: { backgroundColor: "#555", padding: 12, borderRadius: 8, alignItems: "center", flex: 1 },
  secondaryText: { color: "#fff" },
  success: { color: "green", marginBottom: 8 },
});