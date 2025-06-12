// Export all UI components
export * from './LightningPayment';
export * from './OptimizeButton';
export * from './CustomHeader';
export * from './ParallaxSection';

// ContactForm retiré du barrel export pour éviter les conflits côté client
export * from './NotificationBadge';
export * from './ProtonPayment';
export * from './FormInput';
export * from './Hero';
export * from './Button';
export * from './Card';
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

// New optimized landing page components - Revenue focused
export { default as NewRevenueHero } from './NewRevenueHero';
export { default as WhyBecomeNodeRunner } from './WhyBecomeNodeRunner';
export { default as DetailedTestimonials } from './DetailedTestimonials';
export { default as CommunitySection } from './CommunitySection';
export { default as BeginnersFAQ } from './BeginnersFAQ';
export { default as FirstStepsGuide } from './FirstStepsGuide';
export { default as FinalConversionCTA } from './FinalConversionCTA';

// Layout components
export { default as GradientLayout } from '../layout/GradientLayout';
export { HowItWorks } from './HowItWorks';
export { SocialProof } from './SocialProof';
export { CTASection } from './CTASection';

// Hooks de performance
export { useWebVitals } from '../../../hooks/useWebVitals';
export { useCache } from '../../../hooks/useCache';