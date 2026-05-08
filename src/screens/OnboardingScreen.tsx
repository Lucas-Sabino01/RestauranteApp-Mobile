import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet, Text, View, Dimensions, TouchableOpacity, Animated,
  FlatList,
} from 'react-native';
import type { ViewToken } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import type { ThemeColors } from '../theme/colors';
import { FONTS } from '../theme/fonts';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const ONBOARDING_KEY = '@GuiaCuritiba:onboardingDone';

type Slide = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  gradientStart: string;
  gradientEnd: string;
};

type OnboardingScreenProps = {
  onFinish: () => void;
};

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinish }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const SLIDES: Slide[] = [
    {
      id: '1',
      emoji: '🗺️',
      title: 'Explore Curitiba',
      description: 'Descubra restaurantes, cafés, bares e padarias escondidos pela capital paranaense.',
      gradientStart: 'rgba(212, 175, 55, 0.08)',
      gradientEnd: 'rgba(212, 175, 55, 0.02)',
    },
    {
      id: '2',
      emoji: '🍽️',
      title: 'Cardápios completos',
      description: 'Veja o menu, fotos dos pratos e preços antes de sair de casa. Sem surpresas!',
      gradientStart: 'rgba(255, 107, 107, 0.08)',
      gradientEnd: 'rgba(255, 107, 107, 0.02)',
    },
    {
      id: '3',
      emoji: '⭐',
      title: 'Avalie e salve',
      description: 'Favorite os melhores lugares, deixe avaliações e ajude outros curitibanos.',
      gradientStart: 'rgba(255, 193, 7, 0.08)',
      gradientEnd: 'rgba(255, 193, 7, 0.02)',
    },
    {
      id: '4',
      emoji: '📍',
      title: 'Perto de você',
      description: 'Use o mapa interativo para encontrar opções ao seu redor em tempo real.',
      gradientStart: 'rgba(76, 175, 80, 0.08)',
      gradientEnd: 'rgba(76, 175, 80, 0.02)',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(bounceAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      bounceAnim.setValue(0);
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const handleFinish = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    onFinish();
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index ?? 0;
      setCurrentIndex(newIndex);
      bounceAnim.setValue(0);
      Animated.spring(bounceAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }
  }).current;

  const renderSlide = ({ item, index }: { item: Slide; index: number }) => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];
    const textOpacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    });
    const textTranslate = scrollX.interpolate({
      inputRange,
      outputRange: [40, 0, -40],
      extrapolate: 'clamp',
    });
    const emojiScale = scrollX.interpolate({
      inputRange,
      outputRange: [0.4, 1, 0.4],
      extrapolate: 'clamp',
    });
    const emojiRotate = scrollX.interpolate({
      inputRange,
      outputRange: ['-15deg', '0deg', '15deg'],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.slide}>
        <View style={[styles.slideGradient, { backgroundColor: item.gradientStart }]} />
        
        <View style={styles.emojiSection}>
          <Animated.View style={[
            styles.emojiCircle,
            {
              transform: [
                { scale: emojiScale },
                { rotate: emojiRotate },
              ],
            },
          ]}>
            <Text style={styles.emoji}>{item.emoji}</Text>
          </Animated.View>
          
          {/* Decorative floating dots */}
          <View style={[styles.floatingDot, styles.dot1, { backgroundColor: colors.accent }]} />
          <View style={[styles.floatingDot, styles.dot2, { backgroundColor: colors.star }]} />
          <View style={[styles.floatingDot, styles.dot3, { backgroundColor: colors.success }]} />
        </View>
        
        <Animated.View style={[styles.textSection, { opacity: textOpacity, transform: [{ translateX: textTranslate }] }]}>
          <Text style={styles.slideTitle}>{item.title}</Text>
          <Text style={styles.slideDescription}>{item.description}</Text>
        </Animated.View>
      </View>
    );
  };

  const isLast = currentIndex === SLIDES.length - 1;

  return (
    <View style={styles.container}>
      {!isLast && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip} activeOpacity={0.7}>
          <Text style={styles.skipText}>Pular</Text>
        </TouchableOpacity>
      )}
      
      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />
      
      <View style={styles.footer}>
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          {SLIDES.map((_, index) => {
            const dotWidth = scrollX.interpolate({
              inputRange: [
                (index - 1) * SCREEN_WIDTH,
                index * SCREEN_WIDTH,
                (index + 1) * SCREEN_WIDTH,
              ],
              outputRange: [8, 32, 8],
              extrapolate: 'clamp',
            });
            const dotOpacity = scrollX.interpolate({
              inputRange: [
                (index - 1) * SCREEN_WIDTH,
                index * SCREEN_WIDTH,
                (index + 1) * SCREEN_WIDTH,
              ],
              outputRange: [0.25, 1, 0.25],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={index}
                style={[styles.dot, { width: dotWidth, opacity: dotOpacity }]}
              />
            );
          })}
        </View>
        
        {/* Step counter */}
        <Text style={styles.stepCounter}>{currentIndex + 1} de {SLIDES.length}</Text>
        
        <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.8}>
          {isLast ? (
            <>
              <Text style={styles.nextButtonText}>Explorar agora</Text>
              <Ionicons name="sparkles" size={20} color={colors.primary} />
            </>
          ) : (
            <>
              <Text style={styles.nextButtonText}>Próximo</Text>
              <Ionicons name="arrow-forward" size={20} color={colors.primary} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  skipButton: {
    position: 'absolute',
    top: 55,
    right: 24,
    zIndex: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  skipText: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '600',
  },
  slide: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 180,
  },
  slideGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.55,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  emojiSection: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 48,
  },
  emojiCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  emoji: {
    fontSize: 72,
  },
  floatingDot: {
    position: 'absolute',
    borderRadius: 20,
  },
  dot1: {
    width: 12,
    height: 12,
    top: 20,
    right: 10,
    opacity: 0.5,
  },
  dot2: {
    width: 8,
    height: 8,
    bottom: 30,
    left: 15,
    opacity: 0.4,
  },
  dot3: {
    width: 10,
    height: 10,
    top: 60,
    left: 5,
    opacity: 0.3,
  },
  textSection: {
    alignItems: 'center',
  },
  slideTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    fontFamily: FONTS.bold,
    marginBottom: 16,
  },
  slideDescription: {
    fontSize: 17,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 28,
    fontFamily: FONTS.regular,
    paddingHorizontal: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  stepCounter: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: 36,
    paddingVertical: 18,
    borderRadius: 20,
    gap: 10,
    minWidth: 180,
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.primary,
    fontFamily: FONTS.semiBold,
  },
});
