import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { useCart } from '../contexts/CartContext';

import type {
  RootTabParamList,
  HomeStackParamList,
  SearchStackParamList,
  CartStackParamList,
  ProfileStackParamList,
} from './types';

import { HomeScreen } from '../screens/HomeScreen';
import { DetailScreen } from '../screens/DetailScreen';
import { CartScreen } from '../screens/CartScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const SearchStack = createNativeStackNavigator<SearchStackParamList>();
const CartStack = createNativeStackNavigator<CartStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Detail" component={DetailScreen} />
    </HomeStack.Navigator>
  );
}

function SearchStackNavigator() {
  return (
    <SearchStack.Navigator screenOptions={{ headerShown: false }}>
      <SearchStack.Screen name="Search" component={SearchScreen} />
      <SearchStack.Screen name="SearchDetail" component={DetailScreen} />
    </SearchStack.Navigator>
  );
}

function CartStackNavigator() {
  return (
    <CartStack.Navigator screenOptions={{ headerShown: false }}>
      <CartStack.Screen name="Cart" component={CartScreen} />
      <CartStack.Screen name="Checkout" component={CheckoutScreen} />
    </CartStack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="Login" component={LoginScreen} />
      <ProfileStack.Screen name="Register" component={RegisterScreen} />
      <ProfileStack.Screen name="Orders" component={OrdersScreen} />
      <ProfileStack.Screen name="Favorites" component={FavoritesScreen} />
      <ProfileStack.Screen name="FavoritesDetail" component={DetailScreen} />
    </ProfileStack.Navigator>
  );
}

const CartTabBadge: React.FC<{ count: number }> = ({ count }) => {
  if (count <= 0) return null;
  return (
    <View style={badgeStyles.badge}>
      <Text style={badgeStyles.text}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
};

const badgeStyles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -12,
    backgroundColor: COLORS.danger,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  text: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});

type TabIconProps = {
  iconName: keyof typeof Ionicons.glyphMap;
  iconNameFocused: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  badge?: number;
};

const TabIcon: React.FC<TabIconProps> = ({ iconName, iconNameFocused, focused, badge }) => (
  <View style={{ alignItems: 'center', position: 'relative' }}>
    <Ionicons
      name={focused ? iconNameFocused : iconName}
      size={24}
      color={focused ? COLORS.accent : COLORS.textMuted}
    />
    {badge !== undefined && <CartTabBadge count={badge} />}
    {focused && (
      <View
        style={{
          width: 20,
          height: 3,
          backgroundColor: COLORS.accent,
          borderRadius: 2,
          marginTop: 4,
        }}
      />
    )}
  </View>
);

export const AppNavigator = () => {
  const { totalItems } = useCart();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: COLORS.card,
            borderTopColor: COLORS.border,
            borderTopWidth: 1,
            height: 70,
            paddingBottom: 10,
            paddingTop: 8,
          },
          tabBarActiveTintColor: COLORS.accent,
          tabBarInactiveTintColor: COLORS.textMuted,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        }}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeStackNavigator}
          options={{
            tabBarLabel: 'Início',
            tabBarIcon: ({ focused }) => (
              <TabIcon iconName="home-outline" iconNameFocused="home" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="SearchTab"
          component={SearchStackNavigator}
          options={{
            tabBarLabel: 'Buscar',
            tabBarIcon: ({ focused }) => (
              <TabIcon iconName="search-outline" iconNameFocused="search" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="CartTab"
          component={CartStackNavigator}
          options={{
            tabBarLabel: 'Carrinho',
            tabBarIcon: ({ focused }) => (
              <TabIcon
                iconName="cart-outline"
                iconNameFocused="cart"
                focused={focused}
                badge={totalItems}
              />
            ),
          }}
        />
        <Tab.Screen
          name="ProfileTab"
          component={ProfileStackNavigator}
          options={{
            tabBarLabel: 'Perfil',
            tabBarIcon: ({ focused }) => (
              <TabIcon iconName="person-outline" iconNameFocused="person" focused={focused} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
