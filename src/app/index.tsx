import { Image } from "expo-image";
import { router } from "expo-router";
import {
  FileCog,
  FilePlusCorner,
  UserRoundCog,
  UserRoundStar,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { useUser } from "../contexts/user-context";
import { listPosts, searchPosts } from "../lib/api";
import type { Post } from "../types/posts";

const MIN_ITEM_WIDTH = 260; // Minimum width for each item
const GAP = 16;
const PADDING = 16;

export default function HomeScreen() {
  const { user, loading } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [query, setQuery] = useState("");
  const { width } = useWindowDimensions();

  const AVAILABLE_WIDTH = width - PADDING * 2;
  const NUM_COLUMNS = Math.max(
    1,
    Math.floor((AVAILABLE_WIDTH + GAP) / (MIN_ITEM_WIDTH + GAP)),
  );
  const ITEM_WIDTH = (AVAILABLE_WIDTH - GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user]);

  useEffect(() => {
    if (!user) return;
    listPosts()
      .then((p) => setPosts(p.filter((x) => x.status === "publicado")))
      .catch(() => setPosts([]));
  }, [user]);

  async function handleSearch() {
    const res = await searchPosts({ q: query });
    setPosts(res);
  }

  if (loading || !user) return null;

  const canManagePosts = user.role === "docente" || user.role === "admin";
  const canManageStudents = user.role === "docente" || user.role === "admin";
  const canManageTeachers = user.role === "admin";

  return (
    <View style={styles.content}>
      <View style={styles.actionsRow}>
        {canManagePosts && (
          <Pressable
            style={styles.actionBtn}
            onPress={() => router.push("/posts/new")}
          >
            <FilePlusCorner size={20} strokeWidth={2.5} color="#fff" />
          </Pressable>
        )}
        {canManagePosts && (
          <Pressable
            style={styles.actionBtnSecondary}
            onPress={() => router.push("/posts")}
          >
            <FileCog size={20} strokeWidth={2.5} color="#fff" />
          </Pressable>
        )}
        {canManageStudents && (
          <Pressable
            style={styles.actionBtnSecondary}
            onPress={() => router.push("/students")}
          >
            <UserRoundCog size={20} strokeWidth={2.5} color="#fff" />
          </Pressable>
        )}
        {canManageTeachers && (
          <Pressable
            style={styles.actionBtnSecondary}
            onPress={() => router.push("/teachers")}
          >
            <UserRoundStar size={20} strokeWidth={2.5} color="#fff" />
          </Pressable>
        )}
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
        numColumns={NUM_COLUMNS}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={NUM_COLUMNS > 1 ? { gap: GAP } : undefined}
        data={posts}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.card, { width: ITEM_WIDTH }]}
            onPress={() => router.push(`/posts/${item.id}`)}
          >
            {item.image ? (
              <Image
                source={{ uri: item.image }}
                style={styles.cardImage}
                contentFit="cover"
              />
            ) : (
              <View style={styles.cardImagePlaceholder}>
                <Text style={styles.cardImagePlaceholderText}>Imagem</Text>
              </View>
            )}
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardAuthor}>Por {item.author}</Text>
            <Text
              numberOfLines={4}
              ellipsizeMode="tail"
              style={styles.cardDesc}
            >
              {item.content}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum post publicado.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, backgroundColor: "#fafafa" },
  actionsRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  actionBtn: {
    backgroundColor: "#208AEF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
  },
  actionBtnSecondary: {
    backgroundColor: "#555",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
    marginLeft: 8,
  },
  searchRow: { flexDirection: "row", gap: 8, marginBottom: 16, marginTop: 8 },
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
  buttonText: { color: "#fff" },
  grid: { gap: GAP },
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardImage: { height: 120, width: "100%" },
  cardImagePlaceholder: {
    height: 120,
    width: "100%",
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  cardImagePlaceholderText: { color: "#999", fontSize: 12 },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  cardAuthor: {
    fontSize: 12,
    color: "#555",
    paddingHorizontal: 10,
    paddingTop: 2,
  },
  cardDesc: {
    fontSize: 13,
    color: "#777",
    padding: 10,
    paddingTop: 4,
    lineHeight: 14,
    minHeight: 14 * 4,
  },
  empty: { padding: 24, color: "#888", textAlign: "center" },
});
