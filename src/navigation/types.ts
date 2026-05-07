import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { Estabelecimento } from '../types';

export type HomeStackParamList = {
  Home: undefined;
  Detail: { estabelecimento: Estabelecimento };
};

export type SearchStackParamList = {
  Search: undefined;
  SearchDetail: { estabelecimento: Estabelecimento };
};

export type MapStackParamList = {
  Map: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  Login: undefined;
  Register: undefined;
  Favorites: undefined;
  FavoritesDetail: { estabelecimento: Estabelecimento };
  Settings: undefined;
  EditProfile: undefined;
};

export type RootTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList> | undefined;
  SearchTab: NavigatorScreenParams<SearchStackParamList> | undefined;
  MapTab: NavigatorScreenParams<MapStackParamList> | undefined;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList> | undefined;
};

export type RootTabNavigationProp = BottomTabNavigationProp<RootTabParamList>;

// Home Stack
export type HomeScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'Home'>,
  BottomTabScreenProps<RootTabParamList>
>;

export type DetailScreenProps = NativeStackScreenProps<HomeStackParamList, 'Detail'>;

// Search Stack
export type SearchScreenProps = CompositeScreenProps<
  NativeStackScreenProps<SearchStackParamList, 'Search'>,
  BottomTabScreenProps<RootTabParamList>
>;

export type SearchDetailScreenProps = NativeStackScreenProps<SearchStackParamList, 'SearchDetail'>;

// Map Stack
export type MapScreenProps = NativeStackScreenProps<MapStackParamList, 'Map'>;

// Profile Stack
export type ProfileScreenProps = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;
export type LoginScreenProps = NativeStackScreenProps<ProfileStackParamList, 'Login'>;
export type RegisterScreenProps = NativeStackScreenProps<ProfileStackParamList, 'Register'>;

export type FavoritesScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileStackParamList, 'Favorites'>,
  BottomTabScreenProps<RootTabParamList>
>;

export type FavoritesDetailScreenProps = NativeStackScreenProps<ProfileStackParamList, 'FavoritesDetail'>;

export type AnyDetailScreenProps = {
  route: { params: { estabelecimento: Estabelecimento } };
  navigation: { goBack: () => void };
};
