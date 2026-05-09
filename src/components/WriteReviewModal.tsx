import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, Modal, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useTheme } from '../contexts/ThemeContext';
import type { ThemeColors } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import { StarRating } from './ui/StarRating';
import type { Review } from '../types';

type WriteReviewModalProps = {
  visible: boolean;
  estabelecimentoNome: string;
  initialReview?: Review | null;
  onSubmit: (nota: number, comentario: string, id?: string) => void;
  onClose: () => void;
};

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  visible,
  estabelecimentoNome,
  initialReview,
  onSubmit,
  onClose,
}) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');

  // Sincroniza o estado com a review inicial se ela for fornecida
  React.useEffect(() => {
    if (visible) {
      if (initialReview) {
        setNota(initialReview.nota);
        setComentario(initialReview.comentario);
      } else {
        setNota(0);
        setComentario('');
      }
    }
  }, [visible, initialReview]);

  const handleSubmit = () => {    if (nota === 0) {
      Toast.show({ type: 'error', text1: 'Selecione uma nota', visibilityTime: 2000 });
      return;
    }
    if (comentario.trim().length < 10) {
      Toast.show({ type: 'error', text1: 'Escreva pelo menos 10 caracteres', visibilityTime: 2000 });
      return;
    }
    onSubmit(nota, comentario.trim(), initialReview?.id);
    setNota(0);
    setComentario('');
    Toast.show({ 
      type: 'success', 
      text1: initialReview ? 'Avaliação atualizada!' : 'Avaliação enviada!', 
      text2: 'Obrigado pelo feedback ❤️', 
      visibilityTime: 2500 
    });
  };

  const handleClose = () => {
    setNota(0);
    setComentario('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>{initialReview ? 'Editar Avaliação' : 'Avaliar'}</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>{estabelecimentoNome}</Text>
          <View style={styles.starsSection}>
            <Text style={styles.starsLabel}>Sua nota</Text>
            <StarRating rating={nota} size={36} interactive onChange={setNota} />
            {nota > 0 && (
              <Text style={styles.starsValue}>
                {nota === 1 ? 'Ruim' : nota === 2 ? 'Regular' : nota === 3 ? 'Bom' : nota === 4 ? 'Muito bom' : 'Excelente!'}
              </Text>
            )}
          </View>
          <Text style={styles.inputLabel}>Seu comentário</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Conte sua experiência neste lugar..."
            placeholderTextColor={colors.textMuted}
            value={comentario}
            onChangeText={setComentario}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={styles.charCount}>{comentario.length}/500</Text>
          <TouchableOpacity
            style={[styles.submitBtn, (nota === 0 || comentario.trim().length < 10) && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Ionicons name={initialReview ? "save" : "send"} size={18} color={colors.primary} />
            <Text style={styles.submitBtnText}>{initialReview ? 'Salvar alterações' : 'Enviar avaliação'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.primary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: FONTS.bold,
  },
  subtitle: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: '600',
    marginBottom: 24,
  },
  starsSection: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 20,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  starsLabel: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  starsValue: {
    fontSize: 15,
    color: colors.accent,
    fontWeight: '700',
    marginTop: 10,
  },
  inputLabel: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  textInput: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    fontSize: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 100,
    fontFamily: FONTS.regular,
  },
  charCount: {
    textAlign: 'right',
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 6,
    marginBottom: 20,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
});
