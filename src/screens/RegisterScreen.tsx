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
import type { RegisterScreenProps } from '../navigation/types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [confirmarSenhaVisivel, setConfirmarSenhaVisivel] = useState(false);
  
  const [erros, setErros] = useState<{ nome?: string; email?: string; senha?: string; confirmarSenha?: string; geral?: string }>({});
  const [sucessoMsg, setSucessoMsg] = useState('');
  
  const { register, loading } = useAuth();

  const validar = () => {
    const novosErros: typeof erros = {};
    
    if (!nome.trim()) {
      novosErros.nome = 'Nome obrigatório';
    } else if (nome.trim().split(' ').length < 2) {
      novosErros.nome = 'Digite seu nome completo';
    }

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

    if (!confirmarSenha.trim()) {
      novosErros.confirmarSenha = 'Confirme sua senha';
    } else if (senha !== confirmarSenha) {
      novosErros.confirmarSenha = 'As senhas não coincidem';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleRegister = async () => {
    if (!validar()) return;
    
    const sucesso = await register(nome.trim(), email.trim(), senha);

    if (sucesso) {
      setSucessoMsg('Conta criada com sucesso! Bem-vindo ao Guia Curitiba.');
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    } else {
      setErros({ geral: 'Não foi possível criar a conta. Tente novamente.' });
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

          <View style={styles.titleContainer}>
            <Text style={styles.titulo}>Criar conta</Text>
            <Text style={styles.subtitulo}>Preencha os dados abaixo para começar</Text>
          </View>

          {erros.geral && (
            <View style={styles.erroGeralContainer}>
              <Ionicons name="alert-circle" size={16} color={colors.danger} />
              <Text style={styles.erroGeralText}>{erros.geral}</Text>
            </View>
          )}

          {sucessoMsg ? (
            <View style={styles.sucessoContainer}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              <Text style={styles.sucessoText}>{sucessoMsg}</Text>
            </View>
          ) : null}

          <Text style={styles.inputLabel}>Nome completo</Text>
          <View style={[styles.inputContainer, erros.nome ? styles.inputError : null]}>
            <Ionicons name="person-outline" size={18} color={erros.nome ? colors.danger : colors.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="Seu nome"
              placeholderTextColor={colors.textMuted}
              value={nome}
              onChangeText={(t) => { setNome(t); if (erros.nome) setErros(p => ({ ...p, nome: undefined })); }}
              autoCapitalize="words"
            />
          </View>
          {erros.nome && <Text style={styles.erroText}>{erros.nome}</Text>}

          <Text style={[styles.inputLabel, { marginTop: erros.nome ? 4 : 0 }]}>Email</Text>
          <View style={[styles.inputContainer, erros.email ? styles.inputError : null]}>
            <Ionicons name="mail-outline" size={18} color={erros.email ? colors.danger : colors.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={(t) => { setEmail(t); if (erros.email) setErros(p => ({ ...p, email: undefined })); }}
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
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor={colors.textMuted}
              value={senha}
              onChangeText={(t) => { setSenha(t); if (erros.senha) setErros(p => ({ ...p, senha: undefined })); }}
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

          <Text style={[styles.inputLabel, { marginTop: erros.senha ? 4 : 0 }]}>Confirmar senha</Text>
          <View style={[styles.inputContainer, erros.confirmarSenha ? styles.inputError : null]}>
            <Ionicons name="lock-closed-outline" size={18} color={erros.confirmarSenha ? colors.danger : colors.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="Repita a senha"
              placeholderTextColor={colors.textMuted}
              value={confirmarSenha}
              onChangeText={(t) => { setConfirmarSenha(t); if (erros.confirmarSenha) setErros(p => ({ ...p, confirmarSenha: undefined })); }}
              secureTextEntry={!confirmarSenhaVisivel}
            />
            <TouchableOpacity onPress={() => setConfirmarSenhaVisivel(!confirmarSenhaVisivel)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons
                name={confirmarSenhaVisivel ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          </View>
          {erros.confirmarSenha && <Text style={styles.erroText}>{erros.confirmarSenha}</Text>}

          <Text style={styles.termos}>
            Ao criar conta, você concorda com nossos{' '}
            <Text style={styles.termosLink}>Termos de Uso</Text> e{' '}
            <Text style={styles.termosLink}>Política de Privacidade</Text>.
          </Text>

          <TouchableOpacity
            style={[styles.registerBtn, (loading || !!sucessoMsg) && styles.registerBtnDisabled]}
            onPress={handleRegister}
            disabled={loading || !!sucessoMsg}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={colors.primary} />
            ) : !!sucessoMsg ? (
              <Ionicons name="checkmark" size={24} color={colors.primary} />
            ) : (
              <Text style={styles.registerBtnText}>Criar conta</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.footerTexto}>Já tem conta? </Text>
            <TouchableOpacity onPress={() => navigation.replace('Login')}>
              <Text style={styles.footerLink}>Entrar</Text>
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
  titleContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 15,
    color: colors.textMuted,
  },
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
  sucessoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success + '18',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.success + '40',
  },
  sucessoText: {
    flex: 1,
    fontSize: 13,
    color: colors.success,
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
  termos: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 18,
    marginTop: 12,
    marginBottom: 24,
    textAlign: 'center',
  },
  termosLink: {
    color: colors.accent,
    fontWeight: '600',
  },
  registerBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  registerBtnDisabled: { opacity: 0.7 },
  registerBtnText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
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
