import { router } from "expo-router";
import { useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { PostForm, type PostFormValues } from "../../components/post-form";
import { useUser } from "../../contexts/user-context";
import { createPost, togglePostStatus } from "../../lib/api";

export default function NewPostScreen() {
  const { user, loading } = useUser();

  const allowedRoles = user?.role === "docente" || user?.role === "admin";
  useEffect(() => {
    if (!loading && (!user || !allowedRoles)) {
      router.replace("/login");
    }
  }, [loading, user, allowedRoles]);

  if (loading) return null;
  if (!user || !allowedRoles) {
    return null;
  }

  async function handleSave(values: PostFormValues) {
    await createPost({
      title: values.title,
      content: values.content,
      author: values.author,
      acceptsComments: values.acceptsComments,
    });
    router.push("/posts");
  }

  async function handlePublish(values: PostFormValues) {
    const created = await createPost({
      title: values.title,
      content: values.content,
      author: values.author,
      acceptsComments: values.acceptsComments,
    });
    await togglePostStatus(created.id);
    router.push("/posts");
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.scrollContent}
    >
      <PostForm
        initialValues={{
          title: "",
          content: "",
          author: user.name,
          acceptsComments: false,
        }}
        submitLabel="Salvar post"
        showPublishButton
        publishLabel="Publicar"
        onSave={handleSave}
        onPublish={handlePublish}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 16 },
});
