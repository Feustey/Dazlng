// Export all UI components
export * from './ProtonPayments';
export * from './LightningPayment';
export * from './OptimizeButton';
export * from './CustomHeader';
export * from './ParallaxSection';
export * from './ThreeHero';
// ContactForm retiré du barrel export pour éviter les conflits côté client
export * from './NotificationBadge';
export * from './ProtonPayment';
export * from './FormInput';
export * from './Hero';
export * from './Button';
export * from './Card';
export * from './TabBarIcon';
export * from './Themed';
export * from './BenefitCard';
export * from './FeaturesList';
export * from './HeroSection';
export * from './PageTitle';
export * from './PricingCard';
export * from './ProductCard';
export * from './GradientTitle';
// export * from './ui';
// export * from './layout';
export { useToast } from './use-toast';

// Composants optimisés pour les performances
export { OptimizedImage } from './OptimizedImage';
export { LazyList } from './LazyList';
export { PageLoader, usePageLoader } from './PageLoader';

// New optimized landing page components
export { default as NewHero } from './NewHero';

// Layout components
export { default as GradientLayout } from '../layout/GradientLayout';
export { HowItWorks } from './HowItWorks';
export { SocialProof } from './SocialProof';
export { CTASection } from './CTASection';

// Hooks de performance
export { useWebVitals } from '../../../hooks/useWebVitals';
export { useCache } from '../../../hooks/useCache';
export { useServiceWorker } from '../../../hooks/useServiceWorker';