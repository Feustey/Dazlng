import { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  Home: undefined;
  Dazbox: undefined;
  Daznode: undefined;
  DazPay: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  Login: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type AppRoutes = {
  '(tabs)': {
    dazbox: undefined;
    daznode: undefined;
    dazpay: undefined;
    index: undefined;
  };
  'register': {
    standard: undefined;
    pro: undefined;
  };
  'subscribe': {
    gratuit: undefined;
    standard: undefined;
    premium: undefined;
    'ai-addon': undefined;
  };
  contact: undefined;
  login: undefined;
}; 