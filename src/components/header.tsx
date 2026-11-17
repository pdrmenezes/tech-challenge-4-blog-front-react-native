import { NativeStackHeaderProps, router } from "expo-router";
import {
  FileCog,
  FilePlusCorner,
  House,
  LogOut,
  UserRoundCog,
  UserRoundStar,
  type LucideIcon,
} from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useUser } from "../contexts/user-context";

type MenuItem = {
  label: string;
  icon: LucideIcon;
  onPress: () => void;
};

type IconProps = {
  icon: LucideIcon;
};

const Icon = ({ icon: Icon }: IconProps) => <Icon size={20} />;

export function Header({ options }: NativeStackHeaderProps) {
  const { user, loading, logout } = useUser();
  const [openMenu, setOpenMenu] = useState<"user" | "routes" | null>(null);

  const role = user?.role;
  const isLoggedIn = !!user && !loading;

  const closeMenus = useCallback(() => {
    setOpenMenu(null);
  }, []);

  const routeItems = useMemo<MenuItem[]>(() => {
    const items: MenuItem[] = [];

    items.push({
      label: "Home",
      icon: House,
      onPress: () => {
        closeMenus();
        router.push("/");
      },
    });

    if (role === "admin" || role === "docente") {
      items.push({
        label: "Novo post",
        icon: FilePlusCorner,
        onPress: () => {
          closeMenus();
          router.push("/posts/new");
        },
      });
      items.push({
        label: "Gerenciar posts",
        icon: FileCog,
        onPress: () => {
          closeMenus();
          router.push("/posts");
        },
      });
      items.push({
        label: "Gerenciar alunos",
        icon: UserRoundCog,
        onPress: () => {
          closeMenus();
          router.push("/students");
        },
      });
    }

    if (role === "admin") {
      items.push({
        label: "Gerenciar professores",
        icon: UserRoundStar,
        onPress: () => {
          closeMenus();
          router.push("/teachers");
        },
      });
    }

    items.push({
      label: "Sair",
      icon: LogOut,
      onPress: () => {
        closeMenus();
        logout();
        router.replace("/login");
      },
    });

    return items;
  }, [role, closeMenus, logout]);

  const handleUserLogout = useCallback(() => {
    setOpenMenu(null);
    logout();
    router.replace("/login");
  }, [logout]);

  const isUserMenuOpen = openMenu === "user";
  const isRouteMenuOpen = openMenu === "routes";

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        {isLoggedIn && (
          <Pressable
            style={styles.userButton}
            onPress={() =>
              setOpenMenu((prev) => (prev === "user" ? null : "user"))
            }
          >
            <Text style={styles.userAvatar}>
              {user?.name?.[0]?.toUpperCase() || "U"}
            </Text>
          </Pressable>
        )}

        {options?.title && <Text style={styles.title}>{options.title}</Text>}

        {isLoggedIn && (
          <Pressable
            style={styles.hamburgerButton}
            onPress={() =>
              setOpenMenu((prev) => (prev === "routes" ? null : "routes"))
            }
          >
            <Text style={styles.hamburger}>☰</Text>
          </Pressable>
        )}
      </View>

      {/* {children && <View style={styles.body}>{children}</View>} */}

      {openMenu !== null && isLoggedIn && (
        <Pressable style={styles.overlay} onPress={closeMenus} />
      )}

      {isLoggedIn && isUserMenuOpen && (
        <View style={[styles.dropdown, styles.dropdownLeft]}>
          <View style={styles.dropdownSection}>
            <Text style={styles.dropdownSectionTitle}>{user?.name}</Text>
            <Text style={styles.dropdownSectionSubtitle} numberOfLines={1}>
              {user?.email}
            </Text>
          </View>
          <Pressable style={styles.dropdownItem} onPress={handleUserLogout}>
            <Text style={styles.dropdownItemText}>Sair</Text>
          </Pressable>
        </View>
      )}

      {isRouteMenuOpen && (
        <View style={[styles.dropdown, styles.dropdownRight]}>
          {routeItems.map((item, i) => (
            <Pressable
              key={i}
              style={styles.dropdownItem}
              onPress={item.onPress}
            >
              <Icon icon={item.icon} />
              <Text style={styles.dropdownItemText}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  userButton: {
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#208AEF",
    color: "#fff",
    textAlign: "center",
    lineHeight: 32,
    fontWeight: "600",
    fontSize: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    flex: 1,
    textAlign: "center",
  },
  hamburgerButton: {
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  hamburger: {
    fontSize: 24,
    color: "#333",
    lineHeight: 24,
  },
  body: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 900,
  },
  dropdown: {
    position: "absolute",
    top: 56,
    backgroundColor: "#f2f2f2",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 6,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    zIndex: 1000,
    minWidth: 140,
  },
  dropdownLeft: {
    left: 16,
    alignSelf: "flex-start",
  },
  dropdownRight: {
    right: 16,
    alignSelf: "flex-end",
  },
  dropdownSection: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 4,
  },
  dropdownSectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  dropdownSectionSubtitle: {
    fontSize: 12,
    color: "#555",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },

  dropdownItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  dropdownItemText: {
    fontSize: 15,
    color: "#333",
  },
});
