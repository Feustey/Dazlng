'use client';

import { Admin, Resource } from 'react-admin';
import { supabaseDataProvider } from 'ra-supabase-core';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { customerResource } from '../resources/customers';
import { segmentResource } from '../resources/segments';
import { campaignResource } from '../resources/campaigns';
import { templateResource } from '../resources/templates';
import { CRMDashboard } from '../components/dashboard/CRMDashboard';
import { CRMLayout } from '../components/layout/CRMLayout';

// Configuration Supabase - Utiliser une instance unique
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Validation des variables d'environnement
if (!supabaseUrl || !supabaseKey) {
  console.error('Variables d\'environnement Supabase manquantes pour le CRM');
}

// Utiliser l'instance Supabase partagée
const crmSupabaseClient = getSupabaseBrowserClient();

// Configuration du data provider
const dataProvider = supabaseDataProvider({
  instanceUrl: supabaseUrl,
  apiKey: supabaseKey,
  supabaseClient: crmSupabaseClient,
});

// Auth provider pour développement local - accès libre
const authProvider = {
  login: () => Promise.resolve(),
  logout: () => Promise.resolve('/'),
  checkError: () => Promise.resolve(),
  checkAuth: () => {
    // En développement local, toujours autorisé
    if (process.env.NODE_ENV === 'development') {
      return Promise.resolve();
    }
    // En production, vous pouvez ajouter une vraie logique d'auth ici
    return Promise.resolve();
  },
  getPermissions: () => Promise.resolve('admin'),
  getIdentity: () => Promise.resolve({
    id: 'dev-admin',
    fullName: 'Développeur CRM',
    avatar: undefined,
  }),
};

// Provider i18n français
const i18nProvider = {
  translate: (key: string) => {
    const translations: Record<string, string> = {
      // Actions générales
      'ra.action.save': 'Enregistrer',
      'ra.action.create': 'Créer',
      'ra.action.edit': 'Modifier',
      'ra.action.delete': 'Supprimer',
      'ra.action.show': 'Afficher',
      'ra.action.list': 'Liste',
      'ra.action.add': 'Ajouter',
      'ra.action.cancel': 'Annuler',
      'ra.action.back': 'Retour',
      'ra.action.refresh': 'Actualiser',
      
      // Navigation
      'ra.navigation.no_results': 'Aucun résultat',
      'ra.navigation.next': 'Suivant',
      'ra.navigation.prev': 'Précédent',
      'ra.navigation.page_out_of_boundaries': 'Page %{page} hors limites',
      'ra.navigation.page_out_from_end': 'Impossible d\'aller au-delà de la dernière page',
      'ra.navigation.page_out_from_begin': 'Impossible d\'aller avant la page 1',
      
      // Messages
      'ra.message.yes': 'Oui',
      'ra.message.no': 'Non',
      'ra.message.are_you_sure': 'Êtes-vous sûr ?',
      'ra.message.bulk_delete_title': 'Supprimer %{name} |||| Supprimer %{smart_count} %{name}',
      'ra.message.bulk_delete_content': 'Êtes-vous sûr de vouloir supprimer cet élément ? |||| Êtes-vous sûr de vouloir supprimer ces %{smart_count} éléments ?',
      
      // Ressources CRM avec noms améliorés
      'resources.profiles.name': 'Client |||| Clients',
      'resources.crm_customer_segments.name': 'Segment Client |||| Segments Clients',
      'resources.crm_email_campaigns.name': 'Campagne Email |||| Campagnes Email',
      'resources.crm_email_templates.name': 'Template Email |||| Templates Email',
      
      // Champs spécifiques
      'resources.profiles.fields.id': 'ID',
      'resources.profiles.fields.email': 'Email',
      'resources.profiles.fields.nom': 'Nom',
      'resources.profiles.fields.prenom': 'Prénom',
      'resources.profiles.fields.created_at': 'Date création',
      'resources.profiles.fields.t4g_tokens': 'Tokens T4G',
      
      // Dashboard
      'ra.page.dashboard': 'Tableau de bord',
      
      // Formulaires
      'ra.validation.required': 'Champ obligatoire',
      'ra.validation.minLength': 'Doit contenir au moins %{min} caractères',
      'ra.validation.maxLength': 'Doit contenir au maximum %{max} caractères',
      'ra.validation.email': 'Doit être un email valide',
    };
    return translations[key] || key;
  },
  changeLocale: () => Promise.resolve(),
  getLocale: () => 'fr',
};

export const CRMAdminProvider: React.FC<{ children?: React.ReactNode }> = ({ children: _children }) => {
  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      i18nProvider={i18nProvider}
      dashboard={CRMDashboard}
      layout={CRMLayout}
      title="DazNode CRM"
    >
      <Resource name="profiles" {...customerResource} />
      <Resource name="crm_customer_segments" {...segmentResource} />
      <Resource name="crm_email_campaigns" {...campaignResource} />
      <Resource name="crm_email_templates" {...templateResource} />
    </Admin>
  );
}; 