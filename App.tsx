import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { 
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold 
} from '@expo-google-fonts/poppins';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { CartProvider } from './src/contexts/CartContext';
import { FavoritesProvider } from './src/contexts/FavoritesContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { toastConfig } from './src/components/ui/ToastConfig';
import { COLORS } from './src/theme/colors';

function AppContent() {
  const { isInitializing } = useAuth();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (isInitializing || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.primary }}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  return <AppNavigator />;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <AppContent />
          <Toast config={toastConfig} />
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}