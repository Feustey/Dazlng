// Registre centralisé d'icônes pour optimiser les imports
import { Gauge, ArrowRight, Loader2, TrendingUp, AlertTriangle, 
  Target, Clock, DollarSign, Zap, CheckCircle, Shield,
  Users, MessageCircle, Star, Menu, X, ChevronDown, Check,
  Brain, BarChart3, Settings, Quote, HelpCircle, ChevronUp,
  Mail, Calendar, FileText, Send, Activity, Gift, Copy,
  Share2, Info, Search, Filter, Globe, Database, Trophy,
  Award, Headphones, Lock, ChevronRight, CheckCircle2, Circle,
  // Icônes manquantes
  TrendingDown, AlertCircle, BarChart, PieChart, LineChart,
  XCircle, Bell, Smartphone, Eye, Network, Lightbulb, Cpu,
  Sparkles, Download, MousePointer, Plug, Cog,
  Server, Box, CreditCard} from "lucide-react";

// Registre centralisé avec toutes les icônes
export const IconRegistry = {
  // Icônes principales
  Gauge, ArrowRight, Loader2, TrendingUp, AlertTriangle,
  Target, Clock, DollarSign, Zap, CheckCircle, Shield,
  Users, MessageCircle, Star, Menu, X, ChevronDown, Check,
  Brain, BarChart3, Settings, Quote, HelpCircle, ChevronUp,
  Mail, Calendar, FileText, Send, Activity, Gift, Copy,
  Share2, Info, Search, Filter, Globe, Database, Trophy,
  Award, Headphones, Lock, ChevronRight, CheckCircle2, Circle,
  // Icônes manquantes
  TrendingDown, AlertCircle, BarChart, PieChart, LineChart,
  XCircle, Bell, Smartphone, Eye, Network, Lightbulb, Cpu,
  Sparkles, Download, MousePointer, Plug, Cog,
  Server, Box, CreditCard,
  // Alias pour compatibilité
  TargetIcon: Target,
  TrendingUpIcon: TrendingUp,
  ZapIcon: Zap,
  ShieldIcon: Shield,
  UsersIcon: Users,
  MessageCircleIcon: MessageCircle,
  StarIcon: Star,
  MenuIcon: Menu,
  XIcon: X,
  ChevronDownIcon: ChevronDown,
  CheckIcon: Check,
  BrainIcon: Brain,
  BarChart3Icon: BarChart3,
  SettingsIcon: Settings,
  QuoteIcon: Quote,
  HelpCircleIcon: HelpCircle,
  ChevronUpIcon: ChevronUp,
  MailIcon: Mail,
  CalendarIcon: Calendar,
  FileTextIcon: FileText,
  SendIcon: Send,
  ActivityIcon: Activity,
  GiftIcon: Gift,
  CopyIcon: Copy,
  Share2Icon: Share2,
  InfoIcon: Info,
  SearchIcon: Search,
  FilterIcon: Filter,
  GlobeIcon: Globe,
  DatabaseIcon: Database,
  TrophyIcon: Trophy,
  AwardIcon: Award,
  HeadphonesIcon: Headphones,
  LockIcon: Lock,
  ChevronRightIcon: ChevronRight,
  // Alias pour react-icons (compatibilité)
  FaBolt: Zap,
  FaCheckCircle: CheckCircle,
  FaDownload: Download,
  FaPlug: Plug,
  FaCog: Cog,
  FaChartLine: TrendingUp,
  FaUsers: Users,
  FaMousePointer: MousePointer,
  FaEye: Eye,
  FaArrowRight: ArrowRight,
  FaServer: Server,
  FaBox: Box,
  FaCreditCard: CreditCard,
  FaStar: Star,
  FaQuoteLeft: Quote
};

export type IconName = keyof typeof IconRegistry;

// Hook pour utiliser les icônes de manière optimisée
export const useIcon = (name: IconName) => {
  return IconRegistry[name];
};

// Composant Icon optimisé
export const Icon: React.FC<{ name: IconName; className?: string; size?: number }> = ({
  name, 
  className = "", 
  size = 24 
}) => {
  const IconComponent = IconRegistry[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in registry`);
    return null;
  }
  
  return <IconComponent className={className} size={size} />;
};

// Export direct de toutes les icônes pour compatibilité
export {Gauge, ArrowRight, Loader2, TrendingUp, AlertTriangle,
  Target, Clock, DollarSign, Zap, CheckCircle, Shield,
  Users, MessageCircle, Star, Menu, X, ChevronDown, Check,
  Brain, BarChart3, Settings, Quote, HelpCircle, ChevronUp,
  Mail, Calendar, FileText, Send, Activity, Gift, Copy,
  Share2, Info, Search, Filter, Globe, Database, Trophy,
  Award, Headphones, Lock, ChevronRight, CheckCircle2, Circle,
  TrendingDown, AlertCircle, BarChart, PieChart, LineChart,
  XCircle, Bell, Smartphone, Eye, Network, Lightbulb, Cpu,
  Sparkles, Download, MousePointer, Plug, Cog,
  Server, Box, CreditCard};