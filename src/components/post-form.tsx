import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

export type PostFormValues = {
  title: string;
  content: string;
  author: string;
  acceptsComments: boolean;
};

type PostFormProps = {
  initialValues: PostFormValues;
  submitLabel: string;
  showPublishButton?: boolean;
  publishLabel?: string;
  onSave: (values: PostFormValues) => Promise<void>;
  onPublish: (values: PostFormValues) => Promise<void>;
};

export function PostForm({
  initialValues,
  submitLabel,
  showPublishButton,
  publishLabel,
  onSave,
  onPublish,
}: PostFormProps) {
  const [title, setTitle] = useState(initialValues.title);
  const [content, setContent] = useState(initialValues.content);
  const [author, setAuthor] = useState(initialValues.author);
  const [acceptsComments, setAcceptsComments] = useState(
    initialValues.acceptsComments,
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!title.trim() || !content.trim()) {
      setError("Preencha ao menos título e conteúdo.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave({
        title: title.trim(),
        content: content.trim(),
        author: author.trim() || "Anônimo",
        acceptsComments,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao salvar post.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    if (!title.trim() || !content.trim()) {
      setError("Preencha ao menos título e conteúdo.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onPublish({
        title: title.trim(),
        content: content.trim(),
        author: author.trim() || "Anônimo",
        acceptsComments,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao publicar post.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Título"
      />
      <TextInput
        style={styles.input}
        value={author}
        onChangeText={setAuthor}
        placeholder="Autor"
      />
      <TextInput
        style={[styles.input, styles.textarea]}
        value={content}
        onChangeText={setContent}
        multiline
        placeholder="Conteúdo"
      />
      <View style={styles.commentsRow}>
        <Text style={styles.commentsLabel}>Permitir comentários</Text>
        <Switch
          value={acceptsComments}
          onValueChange={setAcceptsComments}
          disabled={saving}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.actions}>
        <Pressable
          style={[styles.button, saving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.buttonText}>{submitLabel}</Text>
        </Pressable>
        {showPublishButton && (
          <Pressable
            style={[styles.secondary, saving && styles.buttonDisabled]}
            onPress={handlePublish}
            disabled={saving}
          >
            <Text style={styles.secondaryText}>
              {publishLabel ?? "Publicar"}
            </Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  textarea: { minHeight: 140, textAlignVertical: "top" },
  commentsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  commentsLabel: { fontSize: 14, color: "#333" },
  error: { color: "red", marginBottom: 8 },
  actions: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  button: {
    backgroundColor: "#208AEF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontWeight: "600" },
  secondary: {
    backgroundColor: "#555",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
  secondaryText: { color: "#fff" },
});
