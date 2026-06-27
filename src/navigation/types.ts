import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  RecipeDetail: undefined;
  FollowRecipe: undefined;
};

export type DrawerParamList = {
  Main: NavigatorScreenParams<MainStackParamList> | undefined;
  RecipeHistory: undefined;
  Profile: undefined;
};
