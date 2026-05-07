import React from 'react';
import {
  StyleSheet, Text, View, Platform, StatusBar,
  ScrollView, Image, TouchableOpacity, Alert, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import Toast from 'react-native-toast-message';
import { useTheme } from '../contexts/ThemeContext';
import type { ThemeColors } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useReviews } from '../contexts/ReviewsContext';
import { ATIVIDADES_AMIGOS } from '../data/mock';
import type { ProfileScreenProps } from '../navigation/types';

type MenuItem = {
  icone: keyof typeof Ionicons.glyphMap;
  label: string;
  desc: string;
  onPress: () => void;
  danger?: boolean;
};

export const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);

  const { user, isAuthenticated, logout } = useAuth();
  const { favorites } = useFavorites();
  const { userReviewCount } = useReviews();

  const handleLogout = () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair da conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  };

  const handleTestNotification = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({ type: 'error', text1: 'Permissão negada' });
        return;
      }
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Novo café adicionado! ☕',
          body: 'O "Café das Flores" acabou de chegar no Guia Curitiba.',
          sound: true,
        },
        trigger: null,
      });
      Toast.show({ type: 'info', text1: 'Notificação enviada' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Erro ao enviar' });
    }
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.primary} />
        <View style={styles.guestContainer}>
          <Ionicons name="person-circle-outline" size={80} color={colors.textMuted} />
          <Text style={styles.guestTitulo}>Faça login para começar</Text>
          <Text style={styles.guestDesc}>
            Entre na sua conta para salvar seus lugares favoritos e personalizar sua experiência.
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
      icone: 'heart-outline',
      label: 'Favoritos',
      desc: `${favorites.length} lugares salvos`,
      onPress: () => navigation.navigate('Favorites'),
    },
    {
      icone: 'settings-outline',
      label: 'Configurações',
      desc: 'Notificações, tema e privacidade',
      onPress: () => navigation.navigate('Settings'),
    },
    {
      icone: 'help-circle-outline',
      label: 'Ajuda & Suporte',
      desc: 'Central de ajuda e FAQ',
      onPress: () => Linking.openURL('mailto:suporte@guiacuritiba.com.br?subject=Ajuda%20-%20Guia%20Curitiba'),
    },
    {
      icone: 'notifications-outline',
      label: 'Testar Notificação',
      desc: 'Envia uma notificação local',
      onPress: handleTestNotification,
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
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.primary} />

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
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('EditProfile')}
            accessibilityLabel="Editar perfil"
            accessibilityRole="button"
          >
            <Ionicons name="pencil" size={16} color={colors.accent} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumero}>{favorites.length}</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumero}>{userReviewCount}</Text>
            <Text style={styles.statLabel}>Avaliações</Text>
          </View>
        </View>

        <View style={styles.feedContainer}>
          <Text style={styles.feedTitle}>Atividade de Amigos</Text>
          {ATIVIDADES_AMIGOS.map((atividade) => (
            <View key={atividade.id} style={styles.feedItem}>
              <Image source={{ uri: atividade.avatar }} style={styles.feedAvatar} />
              <View style={styles.feedContent}>
                <Text style={styles.feedText}>
                  <Text style={styles.feedName}>{atividade.nome}</Text> {atividade.acao}
                </Text>
                <Text style={styles.feedTime}>{atividade.tempo}</Text>
              </View>
            </View>
          ))}
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
                color={item.danger ? colors.danger : colors.textSecondary}
                style={styles.menuIcone}
              />
              <View style={styles.menuTextos}>
                <Text style={[styles.menuLabel, item.danger && { color: colors.danger }]}>
                  {item.label}
                </Text>
                <Text style={styles.menuDesc}>{item.desc}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.versao}>Guia Curitiba v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  headerTitulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 20,
    marginBottom: 24,
    fontFamily: FONTS.bold,
  },

  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  userAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
    fontFamily: FONTS.semiBold,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textMuted,
  },
  editBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.cardLight,
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
    backgroundColor: colors.card,
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumero: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.accent,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
    marginTop: 4,
  },

  feedContainer: {
    marginBottom: 24,
  },
  feedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  feedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  feedAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  feedContent: {
    flex: 1,
  },
  feedText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  feedName: {
    fontWeight: 'bold',
    color: colors.text,
  },
  feedTime: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
  },

  menuContainer: {
    backgroundColor: colors.card,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    color: colors.text,
    marginBottom: 2,
  },
  menuDesc: {
    fontSize: 12,
    color: colors.textMuted,
  },

  versao: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textMuted,
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
    color: colors.text,
    marginBottom: 10,
    marginTop: 16,
    textAlign: 'center',
  },
  guestDesc: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  loginBtn: {
    backgroundColor: colors.accent,
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 14,
  },
  loginBtnText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerBtn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.accent,
  },
  registerBtnText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
