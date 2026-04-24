import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { Produto } from '../types';

export type HomeStackParamList = {
  Home: undefined;
  Detail: { produto: Produto };
};

export type SearchStackParamList = {
  Search: undefined;
  SearchDetail: { produto: Produto };
};

export type CartStackParamList = {
  Cart: undefined;
  Checkout: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  Login: undefined;
  Register: undefined;
  Orders: undefined;
  Favorites: undefined;
  FavoritesDetail: { produto: Produto };
};

export type RootTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList> | undefined;
  SearchTab: NavigatorScreenParams<SearchStackParamList> | undefined;
  CartTab: NavigatorScreenParams<CartStackParamList> | undefined;
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

// Cart Stack
export type CartScreenProps = CompositeScreenProps<
  NativeStackScreenProps<CartStackParamList, 'Cart'>,
  BottomTabScreenProps<RootTabParamList>
>;

export type CheckoutScreenProps = CompositeScreenProps<
  NativeStackScreenProps<CartStackParamList, 'Checkout'>,
  BottomTabScreenProps<RootTabParamList>
>;

// Profile Stack
export type ProfileScreenProps = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;
export type LoginScreenProps = NativeStackScreenProps<ProfileStackParamList, 'Login'>;
export type RegisterScreenProps = NativeStackScreenProps<ProfileStackParamList, 'Register'>;
export type OrdersScreenProps = NativeStackScreenProps<ProfileStackParamList, 'Orders'>;

export type FavoritesScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileStackParamList, 'Favorites'>,
  BottomTabScreenProps<RootTabParamList>
>;

export type FavoritesDetailScreenProps = NativeStackScreenProps<ProfileStackParamList, 'FavoritesDetail'>;

export type AnyDetailScreenProps = {
  route: { params: { produto: Produto } };
  navigation: { goBack: () => void };
};
