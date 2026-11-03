import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { createPost } from "../../lib/api";
import { useUser } from "../../contexts/user-context";

export default function NewPostScreen() {
  const { user, loading } = useUser();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState("");

  if (loading) return null;
  if (!user || user.role !== "docente") {
    router.replace("/login");
    return null;
  }

  async function handleSubmit() {
    if (!title.trim() || !content.trim()) {
      setError("Preencha ao menos título e conteúdo.");
      return;
    }
    try {
      const post = await createPost({
        title: title.trim(),
        content: content.trim(),
        author: author.trim() || "Anônimo",
      });
      router.replace(`/posts/${post.id}`);
    } catch (e: any) {
      setError(e?.message || "Erro ao criar post.");
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Novo post</Text>
      <TextInput style={styles.input} placeholder="Título" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Autor" value={author} onChangeText={setAuthor} />
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Conteúdo"
        multiline
        value={content}
        onChangeText={setContent}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Salvar post</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 10 },
  textarea: { minHeight: 120, textAlignVertical: "top" },
  button: { backgroundColor: "#208AEF", padding: 12, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600" },
  error: { color: "red", marginBottom: 8 },
});