import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { 
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold 
} from '@expo-google-fonts/poppins';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { FavoritesProvider } from './src/contexts/FavoritesContext';
import { ReviewsProvider } from './src/contexts/ReviewsContext';
import { LocationProvider } from './src/contexts/LocationContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import * as Notifications from 'expo-notifications';
import { SplashScreen } from './src/components/SplashScreen';
import { OnboardingScreen, ONBOARDING_KEY } from './src/screens/OnboardingScreen';
import { toastConfig } from './src/components/ui/ToastConfig';
import { useTheme } from './src/contexts/ThemeContext';
import type { ThemeColors } from './src/theme/colors';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

function AppContent() {
  const { colors } = useTheme();

  const { isInitializing } = useAuth();
  const [splashDone, setSplashDone] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((value) => {
      setOnboardingDone(value === 'true');
    });
  }, []);

  if (isInitializing || !fontsLoaded || onboardingDone === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (!onboardingDone) {
    return <OnboardingScreen onFinish={() => setOnboardingDone(true)} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <AppNavigator />
      {!splashDone && <SplashScreen onFinish={() => setSplashDone(true)} />}
    </View>
  );
}

export default function App() {

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <LocationProvider>
          <FavoritesProvider>
              <ReviewsProvider>
                <AppContent />
                <Toast config={toastConfig} />
              </ReviewsProvider>
            </FavoritesProvider>
          </LocationProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}