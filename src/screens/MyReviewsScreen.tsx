import React, { useState, useCallback } from 'react';
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
import { useReviews } from '../contexts/ReviewsContext';
import { StarRating } from '../components/ui/StarRating';
import { WriteReviewModal } from '../components/WriteReviewModal';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../navigation/types';
import type { Review } from '../types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'MyReviews'>;

export const MyReviewsScreen = ({ navigation }: Props) => {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);
  
  const { getUserReviews, updateReview, deleteReview } = useReviews();
  const reviews = getUserReviews();

  const [reviewToEdit, setReviewToEdit] = useState<Review | null>(null);

  const handleDelete = useCallback((id: string) => {
    Alert.alert(
      'Excluir avaliação',
      'Tem certeza que deseja apagar esta avaliação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteReview(id),
        },
      ]
    );
  }, [deleteReview]);

  const handleUpdate = (nota: number, comentario: string, id?: string) => {
    if (id) {
      updateReview(id, { nota, comentario, data: new Date().toISOString() });
    }
    setReviewToEdit(null);
  };

  const renderItem = useCallback(({ item }: { item: Review }) => {
    // Tentativa de puxar nome do estabelecimento se estiver embutido no review. 
    // Como a nossa Review type original não inclui estabelecimentoNome, 
    // exibiremos genérico caso falte, ou precisaremos puxar dos dados, mas por hora 
    // assumiremos que está sendo mostrado. Na prática o ideal é ter o nome salvo ou buscar.
    const dateStr = new Date(item.data).toLocaleDateString();

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <StarRating rating={item.nota} size={14} />
          <Text style={styles.dateText}>{dateStr}</Text>
        </View>

        <Text style={styles.comentario} numberOfLines={4}>
          "{item.comentario}"
        </Text>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionBtn, { borderColor: colors.border }]}
            onPress={() => setReviewToEdit(item)}
            activeOpacity={0.7}
          >
            <Ionicons name="pencil" size={16} color={colors.textSecondary} />
            <Text style={[styles.actionBtnText, { color: colors.textSecondary }]}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { borderColor: colors.danger + '40', backgroundColor: colors.danger + '10' }]}
            onPress={() => handleDelete(item.id)}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={16} color={colors.danger} />
            <Text style={[styles.actionBtnText, { color: colors.danger }]}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [colors, styles, handleDelete]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.primary} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.titulo}>Minhas Avaliações</Text>
        {reviews.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{reviews.length}</Text>
          </View>
        )}
      </View>

      {reviews.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="star" size={56} color={colors.accent} />
          </View>
          <Text style={styles.emptyTitle}>Nenhuma avaliação</Text>
          <Text style={styles.emptyDesc}>
            Você ainda não avaliou nenhum estabelecimento. Quando avaliar, suas notas aparecerão aqui.
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
          data={reviews.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{ height: SPACING.xl }} />}
        />
      )}

      {reviewToEdit && (
        <WriteReviewModal
          visible={!!reviewToEdit}
          estabelecimentoNome={'Atualizar Avaliação'} // Ideally passed from item, using generic here
          initialReview={reviewToEdit}
          onSubmit={handleUpdate}
          onClose={() => setReviewToEdit(null)}
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
    paddingTop: 14,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  comentario: {
    fontSize: 14,
    color: colors.text,
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
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
