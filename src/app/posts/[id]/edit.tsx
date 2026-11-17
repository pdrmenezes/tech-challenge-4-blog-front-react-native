import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { PostForm, type PostFormValues } from "../../../components/post-form";
import { useUser } from "../../../contexts/user-context";
import { getPost, togglePostStatus, updatePost } from "../../../lib/api";
import type { Post } from "../../../types/posts";

export default function EditPostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, loading } = useUser();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (!id) return;
    getPost(Number(id))
      .then(setPost)
      .catch(() => setPost(null));
  }, [id]);

  useEffect(() => {
    if (
      !loading &&
      (!user || (user.role !== "docente" && user.role !== "admin"))
    ) {
      router.replace("/login");
    }
  }, [loading, user]);

  if (loading) return null;
  if (!user || (user.role !== "docente" && user.role !== "admin")) {
    return null;
  }

  if (!post) {
    return (
      <>
        <Stack.Screen options={{ title: "Editar post" }} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Carregando...</Text>
        </View>
      </>
    );
  }

  const postId = post.id;

  async function handleSave(values: PostFormValues) {
    await updatePost(postId, {
      title: values.title,
      content: values.content,
      author: values.author,
      acceptsComments: values.acceptsComments,
    });
    router.back();
  }

  async function handlePublish(values: PostFormValues) {
    await updatePost(postId, {
      title: values.title,
      content: values.content,
      author: values.author,
      acceptsComments: values.acceptsComments,
    });
    await togglePostStatus(postId);
    router.back();
  }

  return (
    <>
      <Stack.Screen options={{ title: `Editar < ${post.title} >` }} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.badge}>{post.status}</Text>
        <PostForm
          initialValues={{
            title: post.title,
            content: post.content,
            author: post.author,
            acceptsComments: post.accepts_comments,
          }}
          submitLabel="Salvar alterações"
          showPublishButton
          publishLabel={
            post.status === "rascunho" ? "Publicar" : "Mover para rascunho"
          }
          onSave={handleSave}
          onPublish={handlePublish}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 16 },
  badge: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#eee",
    alignSelf: "flex-start",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: { color: "#888" },
});
