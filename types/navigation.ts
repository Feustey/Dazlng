import { NavigatorScreenParams } from '@react-navigation/native';

export type PlanId = 'gratuit' | 'standard' | 'premium' | 'ai-addon';

export type TabParamList = {
  Accueil: undefined;
  Dazbox: undefined;
  Dazpay: undefined;
  Daznode: undefined;
  Fonctionnalités: undefined;
  Compte: undefined;
};

export type RootStackParamList = {
  Main: NavigatorScreenParams<TabParamList>;
  Contact: undefined;
  Buy: undefined;
  Checkout: undefined;
  HowItWorks: undefined;
  Login: undefined;
  Subscribe: {
    plan: PlanId;
  };
  Register: {
    plan: 'standard' | 'pro';
  };
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
    features: undefined;
    home: undefined;
    account: undefined;
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
  buy: undefined;
  checkout: undefined;
  'how-it-works': undefined;
}; 