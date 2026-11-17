import { router } from "expo-router";
import {
  Eye,
  EyeOff,
  FilePlusCorner,
  Pencil,
  Trash,
  Undo,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useUser } from "../../contexts/user-context";
import {
  deletePost,
  listPosts,
  recoverPost,
  togglePostStatus,
} from "../../lib/api";
import type { Post } from "../../types/posts";

export default function AdminPostsScreen() {
  const { user, loading } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (loading) return;
    if (!user || (user.role !== "docente" && user.role !== "admin")) {
      router.replace("/login");
      return;
    }
    listPosts({ limit: 100 }).then(setPosts);
  }, [loading, user]);

  if (loading || !user || (user.role !== "docente" && user.role !== "admin")) {
    return null;
  }

  async function handleToggle(id: number) {
    const updated = await togglePostStatus(id);
    setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)));
  }

  async function handleDelete(id: number) {
    Alert.alert("Excluir post", "Tem certeza que deseja excluir este post?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          const updated = await deletePost(id);
          setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)));
        },
      },
    ]);
  }

  async function handleRecover(id: number) {
    const updated = await recoverPost(id);
    setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)));
  }

  const canManagePosts = user.role === "docente" || user.role === "admin";

  return (
    <View style={styles.content}>
      <View style={styles.headerRow}>
        {canManagePosts && (
          <Pressable
            style={styles.button}
            onPress={() => router.push("/posts/new")}
          >
            <FilePlusCorner size={20} strokeWidth={2.5} color="#fff" />
          </Pressable>
        )}
      </View>

      <FlatList
        contentContainerStyle={styles.list}
        data={posts}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.meta}>
                Criado em:{" "}
                {new Date(item.created_at).toLocaleDateString("pt-BR")} ·
                Atualizado em:{" "}
                {new Date(item.updated_at).toLocaleDateString("pt-BR")}
              </Text>
            </View>
            <View style={styles.cardRow}>
              <Text
                style={[
                  styles.badge,
                  item.status === "publicado" && styles.badgePublicado,
                  item.status === "rascunho" && styles.badgeRascunho,
                  item.status === "excluido" && styles.badgeExcluido,
                ]}
              >
                {item.status === "publicado" && "Publicado"}
                {item.status === "rascunho" && "Rascunho"}
                {item.status === "excluido" && "Excluído"}
              </Text>
              <View style={styles.actions}>
                {item.status === "excluido" && (
                  <Pressable
                    style={styles.iconBtn}
                    onPress={() => handleRecover(item.id)}
                  >
                    <Undo size={16} strokeWidth={2.5} />
                  </Pressable>
                )}
                <Pressable
                  style={styles.iconBtn}
                  onPress={() => handleToggle(item.id)}
                >
                  {item.status === "publicado" ? (
                    <EyeOff size={16} strokeWidth={2.5} />
                  ) : (
                    <Eye size={16} strokeWidth={2.5} />
                  )}
                </Pressable>
                <Pressable
                  style={styles.iconBtn}
                  onPress={() => router.push(`/posts/${item.id}/edit`)}
                >
                  <Pencil size={16} strokeWidth={2.5} />
                </Pressable>
                <Pressable
                  style={[styles.iconBtn, { backgroundColor: "#fdd" }]}
                  onPress={() => handleDelete(item.id)}
                >
                  <Trash size={16} strokeWidth={2.5} color="#900" />
                </Pressable>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum post cadastrado.</Text>
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
  button: { backgroundColor: "#208AEF", padding: 10, borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "600" },
  secondary: {
    backgroundColor: "#555",
    padding: 10,
    borderRadius: 8,
    marginTop: 6,
    alignSelf: "flex-start",
  },
  secondaryText: { color: "#fff", fontWeight: "600", fontSize: 13 },
  list: { paddingBottom: 16, gap: 10 },
  card: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    gap: 10,
    backgroundColor: "#fff",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", flex: 1 },
  meta: { color: "#888", fontSize: 12, marginTop: 4 },
  badge: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
  badgePublicado: { backgroundColor: "#d4edda", color: "#155724" },
  badgeRascunho: { backgroundColor: "#fff3cd", color: "#856404" },
  badgeExcluido: { backgroundColor: "#f8d7da", color: "#721c24" },
  actions: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
    alignItems: "center",
  },
  iconBtn: {
    backgroundColor: "#eee",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  empty: { padding: 16, color: "#888", textAlign: "center" },
});
