import React, { useState } from 'react';
import {
  StyleSheet, Text, View, StatusBar,
  TouchableOpacity, TextInput, KeyboardAvoidingView,
  ScrollView, Platform, Image, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import type { ThemeColors } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import { SPACING } from '../theme/spacing';
import { useAuth } from '../contexts/AuthContext';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../navigation/types';

type EditProfileScreenProps = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;

export const EditProfileScreen = ({ navigation }: EditProfileScreenProps) => {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);
  const { user } = useAuth();

  const [nome, setNome] = useState(user?.nome || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = () => {
    if (!nome.trim()) {
      Alert.alert('Campo obrigatório', 'Preencha seu nome.');
      return;
    }
    Alert.alert(
      'Perfil atualizado!',
      'Suas informações foram salvas com sucesso.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.primary} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
              accessibilityLabel="Voltar"
              accessibilityRole="button"
            >
              <Ionicons name="arrow-back" size={22} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.titulo}>Editar Perfil</Text>
            <TouchableOpacity
              onPress={handleSave}
              accessibilityLabel="Salvar perfil"
              accessibilityRole="button"
            >
              <Text style={styles.saveText}>Salvar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.avatarSection}>
            <Image
              source={{ uri: user?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg' }}
              style={styles.avatar}
              accessibilityLabel="Foto de perfil"
            />
            <TouchableOpacity
              style={styles.changePhotoBtn}
              accessibilityLabel="Alterar foto de perfil"
              accessibilityRole="button"
            >
              <Ionicons name="camera" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.inputLabel}>Nome</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={18} color={colors.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="Seu nome"
              placeholderTextColor={colors.textMuted}
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
              accessibilityLabel="Campo de nome"
            />
          </View>

          <Text style={styles.inputLabel}>Email</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={18} color={colors.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              accessibilityLabel="Campo de email"
            />
          </View>

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            activeOpacity={0.8}
            accessibilityLabel="Salvar alterações"
            accessibilityRole="button"
          >
            <Text style={styles.saveBtnText}>Salvar alterações</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: SPACING.base,
    paddingBottom: SPACING.lg,
  },
  backBtn: {
    marginRight: SPACING.md,
  },
  titulo: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: FONTS.bold,
  },
  saveText: {
    fontSize: 15,
    color: colors.accent,
    fontWeight: 'bold',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.accent,
  },
  changePhotoBtn: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: SPACING.base,
    paddingHorizontal: SPACING.base,
    height: 56,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: SPACING.md,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  saveBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 18,
    borderRadius: SPACING.base,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  saveBtnText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
