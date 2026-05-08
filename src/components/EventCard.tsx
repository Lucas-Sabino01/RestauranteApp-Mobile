import React, { useMemo } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useTheme } from '../contexts/ThemeContext';
import type { ThemeColors } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import type { Evento } from '../types';

type EventCardProps = {
  evento: Evento;
  onPress: () => void;
};

function getCountdown(dataInicio: string): string {
  const now = new Date();
  const start = new Date(dataInicio);
  const diff = start.getTime() - now.getTime();

  if (diff <= 0) return 'Acontecendo agora!';

  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (dias > 0) return `Em ${dias} dia${dias > 1 ? 's' : ''}`;
  return `Em ${horas}h`;
}

function formatEventDate(dataInicio: string): string {
  const date = new Date(dataInicio);
  const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return `${dias[date.getDay()]}, ${date.getDate()} ${meses[date.getMonth()]}`;
}

function formatEventTime(dataInicio: string, dataFim: string): string {
  const start = new Date(dataInicio);
  const end = new Date(dataFim);
  const fmtH = (d: Date) => `${d.getHours()}h${d.getMinutes() > 0 ? d.getMinutes().toString().padStart(2, '0') : ''}`;
  return `${fmtH(start)} - ${fmtH(end)}`;
}

const EventCardInner: React.FC<EventCardProps> = ({ evento, onPress }) => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  const TIPO_CONFIG = {
    'promoção': { icon: 'pricetag' as const, color: colors.success, label: 'PROMOÇÃO' },
    'evento': { icon: 'calendar' as const, color: colors.accent, label: 'EVENTO' },
    'especial': { icon: 'sparkles' as const, color: colors.star, label: 'ESPECIAL' },
  };

  const config = TIPO_CONFIG[evento.tipo];
  const countdown = getCountdown(evento.dataInicio);

  const handleLembrete = async () => {
    try {
      const Constants = require('expo-constants').default;
      if (Constants.appOwnership === 'expo') {
        Toast.show({ type: 'info', text1: 'Lembretes indisponíveis', text2: 'Use um development build' });
        return;
      }
      const Notifications = require('expo-notifications');
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({ type: 'error', text1: 'Permissão negada para notificações' });
        return;
      }
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Lembrete: ${evento.titulo}`,
          body: `O evento no ${evento.estabelecimentoNome} está chegando!`,
          sound: true,
        },
        trigger: null,
      });
      Toast.show({ type: 'success', text1: 'Lembrete ativado!', text2: 'Avisaremos você em breve.' });
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Erro ao agendar lembrete' });
    }
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}
      accessibilityLabel={`Evento: ${evento.titulo} em ${evento.estabelecimentoNome}`}
      accessibilityRole="button"
    >
      <Image source={{ uri: evento.imagem }} style={styles.image} />
      <View style={styles.overlay} />
      <View style={[styles.tipoBadge, { backgroundColor: config.color }]}>
        <Ionicons name={config.icon} size={11} color={colors.primary} />
        <Text style={styles.tipoBadgeText}>{config.label}</Text>
      </View>
      <View style={styles.countdownBadge}>
        <Ionicons name="time-outline" size={12} color={colors.accent} />
        <Text style={styles.countdownText}>{countdown}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.titulo} numberOfLines={1}>{evento.titulo}</Text>
        <Text style={styles.local} numberOfLines={1}>
          📍 {evento.estabelecimentoNome}
        </Text>
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={13} color={colors.textWarm} />
          <Text style={styles.dateText}>{formatEventDate(evento.dataInicio)}</Text>
          <Text style={styles.dateSeparator}>·</Text>
          <Text style={styles.dateText}>{formatEventTime(evento.dataInicio, evento.dataFim)}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.bellButton} onPress={handleLembrete} activeOpacity={0.7}>
        <Ionicons name="notifications-outline" size={16} color={colors.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export const EventCard = React.memo(EventCardInner);
const getStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  card: {
    width: 260,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: isDark ? 'rgba(27, 16, 21, 0.55)' : 'rgba(0, 0, 0, 0.35)',
  },
  tipoBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  tipoBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  countdownBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? 'rgba(27, 16, 21, 0.75)' : 'rgba(0, 0, 0, 0.55)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  countdownText: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: '700',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    fontFamily: FONTS.semiBold,
    marginBottom: 4,
  },
  local: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 6,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dateText: {
    fontSize: 11,
    color: colors.textWarm,
    fontWeight: '500',
  },
  dateSeparator: {
    color: colors.textMuted,
    fontSize: 11,
  },
  bellButton: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
