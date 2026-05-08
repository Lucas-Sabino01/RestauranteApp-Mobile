import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import type { ThemeColors } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import type { Estabelecimento } from '../types';

type ReservationConfirmationProps = {
  visible: boolean;
  estabelecimento: Estabelecimento;
  detalhes: { data: string; hora: string; pessoas: number; obs: string } | null;
  onClose: () => void;
};

export const ReservationConfirmation: React.FC<ReservationConfirmationProps> = ({
  visible,
  estabelecimento,
  detalhes,
  onClose,
}) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, scaleAnim, opacityAnim]);

  if (!detalhes) return null;

  const dataObj = new Date(detalhes.data);
  const dataFormatada = dataObj.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long'
  });

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.container, 
            { 
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }] 
            }
          ]}
        >
          {/* Success Icon */}
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark-circle" size={80} color={colors.success} />
          </View>
          
          <Text style={styles.title}>Reserva Confirmada!</Text>
          <Text style={styles.subtitle}>
            Sua mesa em {estabelecimento.nome} foi reservada com sucesso.
          </Text>
          
          {/* Reservation Card */}
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Ionicons name="calendar-outline" size={20} color={colors.textMuted} />
              <View style={styles.cardInfo}>
                <Text style={styles.cardLabel}>Data</Text>
                <Text style={styles.cardValue}>{dataFormatada}</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.cardRow}>
              <Ionicons name="time-outline" size={20} color={colors.textMuted} />
              <View style={styles.cardInfo}>
                <Text style={styles.cardLabel}>Horário</Text>
                <Text style={styles.cardValue}>{detalhes.hora}</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.cardRow}>
              <Ionicons name="people-outline" size={20} color={colors.textMuted} />
              <View style={styles.cardInfo}>
                <Text style={styles.cardLabel}>Pessoas</Text>
                <Text style={styles.cardValue}>{detalhes.pessoas} {detalhes.pessoas === 1 ? 'pessoa' : 'pessoas'}</Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity style={styles.primaryBtn} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.primaryBtnText}>Voltar ao Início</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    backgroundColor: colors.card,
    borderRadius: 30,
    padding: 30,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    marginBottom: 20,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 50,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: FONTS.bold,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: colors.textMuted,
    fontFamily: FONTS.regular,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  card: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 30,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: FONTS.medium,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  cardValue: {
    fontSize: 16,
    color: colors.text,
    fontFamily: FONTS.semiBold,
    textTransform: 'capitalize',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
    marginLeft: 36,
  },
  primaryBtn: {
    backgroundColor: colors.accent,
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    fontFamily: FONTS.bold,
  },
});
