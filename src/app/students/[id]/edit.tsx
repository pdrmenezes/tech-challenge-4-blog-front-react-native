import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useUser } from "../../../contexts/user-context";
import { getStudent, updateStudent } from "../../../lib/api";
import type { Student, UpdateStudentInput } from "../../../types/people";

export default function EditStudentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, loading } = useUser();
  const [item, setItem] = useState<Student | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [handle, setHandle] = useState("");

  useEffect(() => {
    if (!id) return;
    getStudent(Number(id)).then((s) => {
      setItem(s);
      setName(s.name);
      setEmail(s.email);
      setHandle(s.handle ?? "");
    });
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

  if (!item) {
    return (
      <>
        <Stack.Screen options={{ title: "Editar estudante" }} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Carregando...</Text>
        </View>
      </>
    );
  }

  const currentId = item.id;

  async function handleSave() {
    const input: UpdateStudentInput = {
      name: name.trim(),
      email: email.trim(),
      handle: handle.trim() || null,
    };
    if (password.trim()) {
      input.password = password.trim();
    }
    await updateStudent(currentId, input);
    router.back();
  }

  return (
    <>
      <Stack.Screen options={{ title: `Editar < ${item?.name} >` }} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
      >
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Nome"
        />
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Senha"
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          value={handle}
          onChangeText={setHandle}
          placeholder="Tag (apelido)"
          autoCapitalize="none"
        />
        <Pressable style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Salvar</Text>
        </Pressable>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#208AEF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
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
