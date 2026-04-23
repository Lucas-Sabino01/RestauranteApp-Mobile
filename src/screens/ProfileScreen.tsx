import React from 'react';
import {
  StyleSheet, Text, View, SafeAreaView, Platform, StatusBar,
  ScrollView, Image, TouchableOpacity, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import type { ProfileScreenProps } from '../navigation/types';

type MenuItem = {
  icone: keyof typeof Ionicons.glyphMap;
  label: string;
  desc: string;
  onPress: () => void;
  danger?: boolean;
};

export const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { favorites } = useFavorites();

  const handleLogout = () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair da conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        <View style={styles.guestContainer}>
          <Ionicons name="person-circle-outline" size={80} color={COLORS.textMuted} />
          <Text style={styles.guestTitulo}>Faça login para começar</Text>
          <Text style={styles.guestDesc}>
            Entre na sua conta para fazer pedidos, salvar favoritos e ver seu histórico.
          </Text>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginBtnText}>Entrar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.registerBtn}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerBtnText}>Criar conta</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const menuItems: MenuItem[] = [
    {
      icone: 'cube-outline',
      label: 'Meus Pedidos',
      desc: 'Acompanhe e veja pedidos anteriores',
      onPress: () => navigation.navigate('Orders'),
    },
    {
      icone: 'heart-outline',
      label: 'Favoritos',
      desc: `${favorites.length} itens salvos`,
      onPress: () => navigation.navigate('Favorites'),
    },
    {
      icone: 'location-outline',
      label: 'Endereços',
      desc: 'Gerencie seus endereços de entrega',
      onPress: () => {},
    },
    {
      icone: 'card-outline',
      label: 'Pagamento',
      desc: 'Cartões e métodos de pagamento',
      onPress: () => {},
    },
    {
      icone: 'settings-outline',
      label: 'Configurações',
      desc: 'Notificações, tema e privacidade',
      onPress: () => {},
    },
    {
      icone: 'help-circle-outline',
      label: 'Ajuda & Suporte',
      desc: 'Central de ajuda e FAQ',
      onPress: () => {},
    },
    {
      icone: 'log-out-outline',
      label: 'Sair da conta',
      desc: 'Desconectar do aplicativo',
      onPress: handleLogout,
      danger: true,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitulo}>Perfil</Text>

        <View style={styles.userCard}>
          <Image
            source={{ uri: user?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg' }}
            style={styles.userAvatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.nome}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="pencil" size={16} color={COLORS.accent} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumero}>{favorites.length}</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="ribbon" size={20} color={COLORS.accent} />
            <Text style={styles.statLabel}>Premium</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && { borderBottomWidth: 0 },
              ]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <Ionicons
                name={item.icone}
                size={22}
                color={item.danger ? COLORS.danger : COLORS.textSecondary}
                style={styles.menuIcone}
              />
              <View style={styles.menuTextos}>
                <Text style={[styles.menuLabel, item.danger && { color: COLORS.danger }]}>
                  {item.label}
                </Text>
                <Text style={styles.menuDesc}>{item.desc}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.versao}>Café & Restaurante v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  headerTitulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 24,
  },

  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  userAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  editBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: COLORS.cardLight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statNumero: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginTop: 4,
  },

  menuContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuIcone: {
    marginRight: 14,
  },
  menuTextos: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  menuDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
  },

  versao: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 24,
  },

  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  guestTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
    marginTop: 16,
    textAlign: 'center',
  },
  guestDesc: {
    fontSize: 15,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  loginBtn: {
    backgroundColor: COLORS.accent,
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 14,
  },
  loginBtnText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerBtn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  registerBtnText: {
    color: COLORS.accent,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
