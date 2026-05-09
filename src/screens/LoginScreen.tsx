import React, { useState } from 'react';
import {
  StyleSheet, Text, View, Platform, StatusBar,
  TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import type { ThemeColors } from '../theme/colors';
import { useAuth } from '../contexts/AuthContext';
import type { LoginScreenProps } from '../navigation/types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [erros, setErros] = useState<{ email?: string; senha?: string; geral?: string }>({});
  const { login, loading } = useAuth();

  const validar = () => {
    const novosErros: typeof erros = {};
    if (!email.trim()) {
      novosErros.email = 'Email obrigatório';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      novosErros.email = 'Email inválido';
    }
    if (!senha.trim()) {
      novosErros.senha = 'Senha obrigatória';
    } else if (senha.length < 6) {
      novosErros.senha = 'Mínimo de 6 caracteres';
    }
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleLogin = async () => {
    if (!validar()) return;
    const sucesso = await login(email.trim(), senha);
    if (sucesso) {
      navigation.goBack();
    } else {
      setErros({ geral: 'Email ou senha incorretos. Tente novamente.' });
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
            {erros.geral && (
              <View style={styles.erroGeralContainer}>
                <Ionicons name="alert-circle" size={16} color={colors.danger} />
                <Text style={styles.erroGeralText}>{erros.geral}</Text>
              </View>
            )}

            <Text style={styles.inputLabel}>Email</Text>
            <View style={[styles.inputContainer, erros.email ? styles.inputError : null]}>
              <Ionicons name="mail-outline" size={18} color={erros.email ? colors.danger : colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={(t) => { setEmail(t); if (erros.email) setErros((p) => ({ ...p, email: undefined })); }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {erros.email && <Text style={styles.erroText}>{erros.email}</Text>}

            <Text style={[styles.inputLabel, { marginTop: erros.email ? 4 : 0 }]}>Senha</Text>
            <View style={[styles.inputContainer, erros.senha ? styles.inputError : null]}>
              <Ionicons name="lock-closed-outline" size={18} color={erros.senha ? colors.danger : colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Sua senha"
                placeholderTextColor={colors.textMuted}
                value={senha}
                onChangeText={(t) => { setSenha(t); if (erros.senha) setErros((p) => ({ ...p, senha: undefined })); }}
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
            {erros.senha && <Text style={styles.erroText}>{erros.senha}</Text>}

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
  erroGeralContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.danger + '18',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.danger + '40',
  },
  erroGeralText: {
    flex: 1,
    fontSize: 13,
    color: colors.danger,
    fontWeight: '500',
  },
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
    marginBottom: 4,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: colors.danger + '08',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  erroText: {
    fontSize: 12,
    color: colors.danger,
    fontWeight: '500',
    marginBottom: 12,
    marginLeft: 4,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: 8,
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
