import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import type { ThemeColors } from '../theme/colors';

import type {
  RootTabParamList,
  HomeStackParamList,
  SearchStackParamList,
  MapStackParamList,
  ProfileStackParamList,
} from './types';

import { HomeScreen } from '../screens/HomeScreen';
import { DetailScreen } from '../screens/DetailScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { MapScreen } from '../screens/MapScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const SearchStack = createNativeStackNavigator<SearchStackParamList>();
const MapStack = createNativeStackNavigator<MapStackParamList>();
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

function MapStackNavigator() {
  return (
    <MapStack.Navigator screenOptions={{ headerShown: false }}>
      <MapStack.Screen name="Map" component={MapScreen} />
    </MapStack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="Login" component={LoginScreen} />
      <ProfileStack.Screen name="Register" component={RegisterScreen} />
      <ProfileStack.Screen name="Favorites" component={FavoritesScreen} />
      <ProfileStack.Screen name="FavoritesDetail" component={DetailScreen} />
    </ProfileStack.Navigator>
  );
}

type TabIconProps = {
  iconName: keyof typeof Ionicons.glyphMap;
  iconNameFocused: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  colors: ThemeColors;
};

const TabIcon: React.FC<TabIconProps> = ({ iconName, iconNameFocused, focused, colors }) => (
  <View style={{ alignItems: 'center', position: 'relative' }}>
    <Ionicons
      name={focused ? iconNameFocused : iconName}
      size={24}
      color={focused ? colors.accent : colors.textMuted}
    />
    {focused && (
      <View
        style={{
          width: 20,
          height: 3,
          backgroundColor: colors.accent,
          borderRadius: 2,
          marginTop: 4,
        }}
      />
    )}
  </View>
);

export const AppNavigator = () => {
  const { colors } = useTheme();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            height: 70,
            paddingBottom: 10,
            paddingTop: 8,
          },
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textMuted,
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
              <TabIcon iconName="home-outline" iconNameFocused="home" focused={focused} colors={colors} />
            ),
          }}
        />
        <Tab.Screen
          name="SearchTab"
          component={SearchStackNavigator}
          options={{
            tabBarLabel: 'Buscar',
            tabBarIcon: ({ focused }) => (
              <TabIcon iconName="search-outline" iconNameFocused="search" focused={focused} colors={colors} />
            ),
          }}
        />
        <Tab.Screen
          name="MapTab"
          component={MapStackNavigator}
          options={{
            tabBarLabel: 'Mapa',
            tabBarIcon: ({ focused }) => (
              <TabIcon iconName="map-outline" iconNameFocused="map" focused={focused} colors={colors} />
            ),
          }}
        />
        <Tab.Screen
          name="ProfileTab"
          component={ProfileStackNavigator}
          options={{
            tabBarLabel: 'Perfil',
            tabBarIcon: ({ focused }) => (
              <TabIcon iconName="person-outline" iconNameFocused="person" focused={focused} colors={colors} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
