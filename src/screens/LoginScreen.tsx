import React, { useState } from 'react';
import {
  StyleSheet, Text, View, Platform, StatusBar,
  TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import type { ThemeColors } from '../theme/colors';
import { useAuth } from '../contexts/AuthContext';
import type { LoginScreenProps } from '../navigation/types';

export const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const { login, loading } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha email e senha.');
      return;
    }
    const sucesso = await login(email, senha);

    if (sucesso) {
      navigation.goBack();
    } else {
      Alert.alert('Erro', 'Email ou senha inválidos.');
    }
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
        >
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.brandContainer}>
            <View style={styles.brandIconContainer}>
              <Ionicons name="cafe" size={40} color={colors.accent} />
            </View>
            <Text style={styles.brandNome}>Guia Curitiba</Text>
            <Text style={styles.brandDesc}>Entre na sua conta para continuar</Text>
          </View>

          <View style={styles.formContainer}>
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
                autoCorrect={false}
              />
            </View>

            <Text style={styles.inputLabel}>Senha</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Sua senha"
                placeholderTextColor={colors.textMuted}
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!senhaVisivel}
              />
              <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons
                  name={senhaVisivel ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <Text style={styles.loginBtnText}>Entrar</Text>
              )}
            </TouchableOpacity>

            <View style={styles.divisorRow}>
              <View style={styles.divisorLinha} />
              <Text style={styles.divisorTexto}>ou continue com</Text>
              <View style={styles.divisorLinha} />
            </View>

            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn}>
                <Ionicons name="logo-google" size={20} color={colors.text} />
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <Ionicons name="logo-apple" size={20} color={colors.text} />
                <Text style={styles.socialText}>Apple</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerTexto}>Não tem conta? </Text>
            <TouchableOpacity onPress={() => navigation.replace('Register')}>
              <Text style={styles.footerLink}>Criar conta</Text>
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: 24,
    paddingBottom: 40,
    flexGrow: 1,
  },

  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },

  brandContainer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 40,
  },
  brandIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandNome: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  brandDesc: {
    fontSize: 15,
    color: colors.textMuted,
  },

  formContainer: {},
  inputLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },

  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },

  loginBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginBtnDisabled: { opacity: 0.7 },
  loginBtnText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },

  divisorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divisorLinha: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  divisorTexto: {
    color: colors.textMuted,
    fontSize: 13,
    marginHorizontal: 16,
  },

  socialRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 32,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  socialText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  footerTexto: {
    fontSize: 14,
    color: colors.textMuted,
  },
  footerLink: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: 'bold',
  },
});
