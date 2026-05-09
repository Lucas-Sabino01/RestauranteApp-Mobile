import React, { useCallback } from 'react';
import {
  StyleSheet, Text, View, Platform, StatusBar,
  FlatList, TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import type { ThemeColors } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import { SPACING } from '../theme/spacing';
import { useReservations } from '../contexts/ReservationsContext';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../navigation/types';
import type { Reserva } from '../types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'MyReservations'>;

const STATUS_CONFIG = {
  confirmada: { label: 'Confirmada', color: '#22c55e', bg: '#22c55e18', icon: 'checkmark-circle' as const },
  cancelada: { label: 'Cancelada', color: '#ef4444', bg: '#ef444418', icon: 'close-circle' as const },
};

export const MyReservationsScreen = ({ navigation }: Props) => {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);
  const { reservations, cancelReservation } = useReservations();

  const handleCancel = useCallback((reserva: Reserva) => {
    if (reserva.status === 'cancelada') return;
    Alert.alert(
      'Cancelar reserva',
      `Deseja cancelar a reserva em ${reserva.estabelecimentoNome} para ${reserva.data} às ${reserva.hora}?`,
      [
        { text: 'Voltar', style: 'cancel' },
        {
          text: 'Cancelar reserva',
          style: 'destructive',
          onPress: () => cancelReservation(reserva.id),
        },
      ]
    );
  }, [cancelReservation]);

  const renderItem = useCallback(({ item }: { item: Reserva }) => {
    const status = STATUS_CONFIG[item.status];
    const isCanceled = item.status === 'cancelada';

    return (
      <View style={[styles.card, isCanceled && styles.cardCanceled]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <Text style={[styles.cardNome, isCanceled && styles.textMuted]} numberOfLines={1}>
              {item.estabelecimentoNome}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
              <Ionicons name={status.icon} size={12} color={status.color} />
              <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
            </View>
          </View>
          <Text style={styles.cardEndereco} numberOfLines={1}>{item.estabelecimentoEndereco}</Text>
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.cardInfoRow}>
          <View style={styles.cardInfoItem}>
            <Ionicons name="calendar-outline" size={16} color={colors.accent} />
            <Text style={styles.cardInfoText}>{item.data}</Text>
          </View>
          <View style={styles.cardInfoItem}>
            <Ionicons name="time-outline" size={16} color={colors.accent} />
            <Text style={styles.cardInfoText}>{item.hora}</Text>
          </View>
          <View style={styles.cardInfoItem}>
            <Ionicons name="people-outline" size={16} color={colors.accent} />
            <Text style={styles.cardInfoText}>
              {item.pessoas} {item.pessoas === 1 ? 'pessoa' : 'pessoas'}
            </Text>
          </View>
        </View>

        {item.obs ? (
          <View style={styles.obsContainer}>
            <Ionicons name="chatbubble-outline" size={14} color={colors.textMuted} />
            <Text style={styles.obsText} numberOfLines={2}>{item.obs}</Text>
          </View>
        ) : null}

        {!isCanceled && (
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => handleCancel(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelBtnText}>Cancelar reserva</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }, [colors, styles, handleCancel]);

  const sortedReservations = [...reservations].sort((a, b) => {
    // Active first, then by date
    if (a.status !== b.status) return a.status === 'confirmada' ? -1 : 1;
    return new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime();
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.primary} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.titulo}>Minhas Reservas</Text>
        {reservations.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>
              {reservations.filter(r => r.status === 'confirmada').length}
            </Text>
          </View>
        )}
      </View>

      {reservations.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="calendar" size={56} color={colors.accent} />
          </View>
          <Text style={styles.emptyTitle}>Nenhuma reserva</Text>
          <Text style={styles.emptyDesc}>
            Quando você reservar uma mesa em algum restaurante, ela aparecerá aqui.
          </Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => navigation.getParent<any>()?.navigate('HomeTab')}
            activeOpacity={0.8}
          >
            <Text style={styles.emptyBtnText}>Explorar restaurantes</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={sortedReservations}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          initialNumToRender={5}
          removeClippedSubviews={Platform.OS === 'android'}
          ListHeaderComponent={
            <Text style={styles.listHeader}>
              {reservations.filter(r => r.status === 'confirmada').length} ativa(s) ·{' '}
              {reservations.filter(r => r.status === 'cancelada').length} cancelada(s)
            </Text>
          }
          ListFooterComponent={<View style={{ height: SPACING.xl }} />}
        />
      )}
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backBtn: {
    marginRight: 14,
  },
  titulo: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: FONTS.bold,
  },
  countBadge: {
    backgroundColor: colors.accent,
    minWidth: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  countBadgeText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  listHeader: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 14,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardCanceled: {
    opacity: 0.65,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    gap: 8,
  },
  cardNome: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: FONTS.semiBold,
  },
  textMuted: {
    color: colors.textMuted,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardEndereco: {
    fontSize: 13,
    color: colors.textMuted,
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 12,
  },
  cardInfoRow: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  cardInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardInfoText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  obsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 10,
    backgroundColor: colors.cardLight,
    borderRadius: 10,
    padding: 10,
  },
  obsText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  cancelBtn: {
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.danger,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.danger,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: FONTS.bold,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: FONTS.regular,
    marginBottom: 32,
  },
  emptyBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 16,
  },
  emptyBtnText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
});
