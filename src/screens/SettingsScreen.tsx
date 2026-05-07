import React from 'react';
import {
  StyleSheet, Text, View, StatusBar,
  ScrollView, TouchableOpacity, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import type { ThemeColors } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import { SPACING } from '../theme/spacing';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../navigation/types';

type SettingsScreenProps = NativeStackScreenProps<ProfileStackParamList, 'Settings'>;

type ThemeOption = 'light' | 'dark' | 'system';

export const SettingsScreen = ({ navigation }: SettingsScreenProps) => {
  const { colors, isDark, theme, setTheme } = useTheme();
  const styles = getStyles(colors);

  const themeOptions: { value: ThemeOption; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { value: 'system', label: 'Automático', icon: 'phone-portrait-outline' },
    { value: 'light', label: 'Claro', icon: 'sunny-outline' },
    { value: 'dark', label: 'Escuro', icon: 'moon-outline' },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.primary} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.titulo}>Configurações</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Aparência</Text>
        <View style={styles.card}>
          {themeOptions.map((option, index) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.themeOption,
                index < themeOptions.length - 1 && styles.themeOptionBorder,
                theme === option.value && styles.themeOptionActive,
              ]}
              onPress={() => setTheme(option.value)}
              activeOpacity={0.7}
            >
              <View style={[styles.themeIcon, theme === option.value && styles.themeIconActive]}>
                <Ionicons
                  name={option.icon}
                  size={20}
                  color={theme === option.value ? colors.primary : colors.textMuted}
                />
              </View>
              <View style={styles.themeTextContainer}>
                <Text style={[styles.themeLabel, theme === option.value && { color: colors.accent }]}>
                  {option.label}
                </Text>
              </View>
              {theme === option.value && (
                <Ionicons name="checkmark-circle" size={22} color={colors.accent} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Geral</Text>
        <View style={styles.card}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.settingLabel}>Notificações push</Text>
            </View>
            <Switch
              value={true}
              trackColor={{ false: colors.border, true: colors.accentLight }}
              thumbColor={colors.accent}
            />
          </View>
          <View style={[styles.settingItem, styles.themeOptionBorder]}>
            <View style={styles.settingLeft}>
              <Ionicons name="location-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.settingLabel}>Localização</Text>
            </View>
            <Switch
              value={true}
              trackColor={{ false: colors.border, true: colors.accentLight }}
              thumbColor={colors.accent}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Sobre</Text>
        <View style={styles.card}>
          <View style={styles.aboutItem}>
            <Text style={styles.aboutLabel}>Versão</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
          <View style={[styles.aboutItem, styles.themeOptionBorder]}>
            <Text style={styles.aboutLabel}>Desenvolvido por</Text>
            <Text style={styles.aboutValue}>Lucas</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.md,
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
  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
    marginTop: SPACING.xl,
    marginLeft: SPACING.xs,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: SPACING.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md + 2,
  },
  themeOptionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  themeOptionActive: {
    backgroundColor: colors.accentUltraLight,
  },
  themeIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.cardLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  themeIconActive: {
    backgroundColor: colors.accent,
  },
  themeTextContainer: {
    flex: 1,
  },
  themeLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  settingLabel: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
  },
  aboutLabel: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
  },
  aboutValue: {
    fontSize: 15,
    color: colors.textMuted,
  },
});
