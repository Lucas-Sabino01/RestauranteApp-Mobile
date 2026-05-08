import React, { useState } from 'react';
import {
  StyleSheet, Text, View, Modal, TouchableOpacity,
  ScrollView, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import type { ThemeColors } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import type { Estabelecimento } from '../types';

type ReservationModalProps = {
  visible: boolean;
  estabelecimento: Estabelecimento;
  onClose: () => void;
  onConfirm: (detalhes: { data: string; hora: string; pessoas: number; obs: string }) => void;
};

// Gera próximos 14 dias
const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push({
      date: d,
      dayName: i === 0 ? 'Hoje' : i === 1 ? 'Amanhã' : d.toLocaleDateString('pt-BR', { weekday: 'short' }),
      dayNumber: d.getDate(),
      month: d.toLocaleDateString('pt-BR', { month: 'short' }),
    });
  }
  return dates;
};

// Horários mockados
const TIMES = [
  '11:30', '12:00', '12:30', '13:00', '13:30', '14:00',
  '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
];

export const ReservationModal: React.FC<ReservationModalProps> = ({
  visible,
  estabelecimento,
  onClose,
  onConfirm,
}) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const [dates] = useState(generateDates());
  const [selectedDate, setSelectedDate] = useState(0); // index do array dates
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [people, setPeople] = useState(2);
  const [obs, setObs] = useState('');

  const handleConfirm = () => {
    if (!selectedTime) return;
    
    onConfirm({
      data: dates[selectedDate].date.toISOString(),
      hora: selectedTime,
      pessoas: people,
      obs,
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Reservar Mesa</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            {/* Info do Estabelecimento */}
            <View style={styles.estabInfo}>
              <Text style={styles.estabName}>{estabelecimento.nome}</Text>
              <Text style={styles.estabAddress}>{estabelecimento.endereco}</Text>
            </View>

            {/* Número de Pessoas */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Para quantas pessoas?</Text>
              <View style={styles.counterContainer}>
                <TouchableOpacity
                  style={[styles.counterBtn, people <= 1 && styles.counterBtnDisabled]}
                  onPress={() => setPeople(Math.max(1, people - 1))}
                  disabled={people <= 1}
                >
                  <Ionicons name="remove" size={24} color={people <= 1 ? colors.textMuted : colors.primary} />
                </TouchableOpacity>
                
                <Text style={styles.counterText}>{people}</Text>
                
                <TouchableOpacity
                  style={[styles.counterBtn, people >= 12 && styles.counterBtnDisabled]}
                  onPress={() => setPeople(Math.min(12, people + 1))}
                  disabled={people >= 12}
                >
                  <Ionicons name="add" size={24} color={people >= 12 ? colors.textMuted : colors.primary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Data */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Data</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
                {dates.map((d, index) => {
                  const isSelected = selectedDate === index;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[styles.dateCard, isSelected && styles.dateCardSelected]}
                      onPress={() => setSelectedDate(index)}
                    >
                      <Text style={[styles.dayName, isSelected && styles.textSelected]}>
                        {d.dayName.toUpperCase()}
                      </Text>
                      <Text style={[styles.dayNumber, isSelected && styles.textSelected]}>
                        {d.dayNumber}
                      </Text>
                      <Text style={[styles.monthName, isSelected && styles.textSelected]}>
                        {d.month.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Horário */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Horário</Text>
              <View style={styles.timeGrid}>
                {TIMES.map((time, index) => {
                  const isSelected = selectedTime === time;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[styles.timeCard, isSelected && styles.timeCardSelected]}
                      onPress={() => setSelectedTime(time)}
                    >
                      <Text style={[styles.timeText, isSelected && styles.textSelected]}>{time}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Observações */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Observações (Opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Aniversário, cadeira de bebê..."
                placeholderTextColor={colors.textMuted}
                value={obs}
                onChangeText={setObs}
                multiline
                maxLength={150}
              />
            </View>
            
            <View style={{ height: 40 }} />
          </ScrollView>

          {/* Footer CTA */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.confirmBtn, !selectedTime && styles.confirmBtnDisabled]}
              onPress={handleConfirm}
              disabled={!selectedTime}
            >
              <Text style={styles.confirmBtnText}>
                {selectedTime ? 'Confirmar Reserva' : 'Selecione um horário'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.primary,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: FONTS.bold,
  },
  scrollContent: {
    padding: 20,
  },
  estabInfo: {
    marginBottom: 30,
  },
  estabName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: FONTS.bold,
    marginBottom: 4,
  },
  estabAddress: {
    fontSize: 14,
    color: colors.textMuted,
    fontFamily: FONTS.regular,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: FONTS.semiBold,
    marginBottom: 16,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    alignSelf: 'flex-start',
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  counterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterBtnDisabled: {
    backgroundColor: colors.border,
  },
  counterText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginHorizontal: 24,
    fontFamily: FONTS.bold,
    width: 30,
    textAlign: 'center',
  },
  hScroll: {
    gap: 12,
  },
  dateCard: {
    width: 70,
    height: 90,
    backgroundColor: colors.card,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateCardSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  dayName: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: FONTS.medium,
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: FONTS.bold,
    marginBottom: 2,
  },
  monthName: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: FONTS.regular,
  },
  textSelected: {
    color: colors.primary,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeCard: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeCardSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  timeText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: FONTS.medium,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    color: colors.text,
    fontSize: 15,
    fontFamily: FONTS.regular,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  footer: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    backgroundColor: colors.primary,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  confirmBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  confirmBtnDisabled: {
    backgroundColor: colors.border,
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    fontFamily: FONTS.bold,
  },
});
