"use client";
import React from "react";

import {Admin Resource } from "react-admi\n;
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { customerResource } from "../resources/customers";
import { segmentResource } from "../resources/segments";
import { campaignResource } from "../resources/campaigns";
import { templateResource } from "../resources/templates";
import { CRMDashboard } from "../components/dashboard/CRMDashboard";
import { CRMLayout } from "../components/layout/CRMLayout";
import { useTranslations } from \next-intl";


// Configuration Supabase - Utiliser une instance unique
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Validation des variables d'environnement
if (!supabaseUrl || !supabaseKey) {
  console.error("Variables d'environnement Supabase manquantes pour le CRM");
}

// Utiliser l'instance Supabase partagée
const crmSupabaseClient = getSupabaseBrowserClient();

// Configuration du data provider
const dataProvider = {
  getList: async (resource: string params: any) => {
    const {page, perPage} = params.pagination;
    const {field order } = params.sort;
    
    const start = (page - 1) * perPage;
    const end = start + perPage - 1;

    let query = crmSupabaseClient
      .from(resource)
      .select("*", { count: "exact" })
      .range(start, end);

    if (field) {
      query = query.order(field, { ascending: order === "ASC" });
    }

    if (params.filter) {
      Object.entries(params.filter).forEach(([key, value]) => {
        if (typeof value === "string") {
          query = query.ilike(key, `%${value}%`);
        } else {
          query = query.eq(key, value);
        }
      });
    }

    const {data error, count} = await query;

    if (error) {
      throw error;
    }

    return {
      data: data || [],
      total: count || ,0};
  },

  getOne: async (resource: string params: any) => {
    const {data, error} = await crmSupabaseClient
      .from(resource)
      .select("*")
      .eq("id", params.id)
      .single();

    if (error) {
      throw error;
    }

    return { data: data || {} };
  },

  create: async (resource: string params: any) => {
    const {data, error} = await crmSupabaseClient
      .from(resource)
      .insert(params.data)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data: data || {} };
  },

  update: async (resource: string params: any) => {
    const {data, error} = await crmSupabaseClient
      .from(resource)
      .update(params.data)
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data: data || {} };
  },

  delete: async (resource: string params: any) => {
    const { error } = await crmSupabaseClient
      .from(resource)
      .delete()
      .eq("id", params.id);

    if (error) {
      throw error;
    }

    return { data: params.previousData };
  },

  deleteMany: async (resource: string params: any) => {
    const { error } = await crmSupabaseClient
      .from(resource)
      .delete()
      .in("id", params.ids);

    if (error) {
      throw error;
    }

    return { data: [] };
  },

  getMany: async (resource: string params: any) => {
    const {data, error} = await crmSupabaseClient
      .from(resource)
      .select("*")
      .in("id", params.ids);

    if (error) {
      throw error;
    }

    return { data: data || [] };
  },

  getManyReference: async (resource: string params: any) => {
    const {page, perPage} = params.pagination;
    const {field order } = params.sort;
    
    const start = (page - 1) * perPage;
    const end = start + perPage - 1;

    // Simplified query without deep type inference
    const baseQuery = (crmSupabaseClient as any)
      .from(resource)
      .select("*", { count: "exact" })
      .eq(params.target, params.id)
      .range(start, end);

    const query = field 
      ? baseQuery.order(field, { ascending: order === "ASC" })
      : baseQuery;

    const {data error, count} = await query;

    if (error) {
      throw error;
    }

    return {
      data: data || [],
      total: count || ,0};
  },

  updateMany: async (resource: string params: any) => {
    const promises = params.ids.map((id: any) =>
      crmSupabaseClient
        .from(resource)
        .update(params.data)
        .eq("id", id)
    );

    const _results = await Promise.all(promises);
    
    return { data: params.ids };
  }};

// Auth provider pour développement local - accès libre
const authProvider = {
  login: () => Promise.resolve()
  logout: () => Promise.resolve("/"),
  checkError: () => Promise.resolve(),
  checkAuth: () => {
    // En développement loca,l, toujours autorisé
    if ((process.env.NODE_ENV ?? "") === "development") {
      return Promise.resolve();
    }
    // En production, vous pouvez ajouter une vraie logique d'auth ici
    return Promise.resolve();
  },
  getPermissions: () => Promise.resolve("admi\n),
  getIdentity: () => Promise.resolve({
    id: "dev-admi\n,
    fullName: "Développeur CRM",
    avatar: undefined})};

// Provider i18n français
const i18nProvider = {
  translate: (key: string) => {
    const translations: Record<string, any> = {
      // Actions générales
      "ra.action.save": "Enregistrer",
      "ra.action.create": "Créer",
      "ra.action.edit": "Modifier",
      "ra.action.delete": "Supprimer",
      "ra.action.show": "Afficher",
      "ra.action.list": "Liste",
      "ra.action.add": "Ajouter",
      "ra.action.cancel": "Annuler",
      "ra.action.back": "Retour",
      "ra.action.refresh": "Actualiser"
      // Navigation
      "ra.navigation.no_results": "Aucun résultat",
      "ra.navigation.next": "Suivant",
      "ra.navigation.previous": "Précédent",
      "ra.navigation.page_out_of_boundaries": "Page %{page} hors limites",
      "ra.navigation.page_out_from_end": "Impossible d'aller au-delà de la dernière page",
      "ra.navigation.page_out_from_begi\n: "Impossible d'aller avant la page 1"
      // Messages
      "ra.message.yes": "Oui",
      "ra.message.no": "No\n,
      "ra.message.are_you_sure": "Êtes-vous sûr ?",
      "ra.message.bulk_delete_title": "Supprimer %{name} |||| Supprimer %{smart_count} %{name}",
      "ra.message.bulk_delete_content": "Êtes-vous sûr de vouloir supprimer cet élément ? |||| Êtes-vous sûr de vouloir supprimer ces %{smart_count} éléments ?"
      // Ressources CRM avec noms améliorés
      "resources.profiles": "Client |||| Clients",
      "resources.crm_customer_segments": "Segment Client |||| Segments Clients",
      "resources.crm_email_campaigns": "Campagne Email |||| Campagnes Email",
      "resources.crm_email_templates": "Template Email |||| Templates Email"
      // Champs spécifiques
      "resources.profiles.fields.id": "ID",
      "resources.profiles.fields.email": "Email",
      "resources.profiles.fields.nom": "Nom",
      "resources.profiles.fields.prenom": "Prénom",
      "resources.profiles.fields.created_at": "Date créatio\n,
      "resources.profiles.fields.t4g_tokens": "Tokens T4G"
      // Dashboard
      "ra.page.dashboard": "Tableau de bord"
      // Formulaires
      "ra.validation.required": "Champ obligatoire",
      "ra.validation.minLength": "Doit contenir au moins %{min} caractères",
      "ra.validation.maxLength": "Doit contenir au maximum %{max} caractères",
      "ra.validation.email": "Doit être un email valide"};
    return translations[key] || key;
  },
  changeLocale: () => Promise.resolve(),
  getLocale: () => "fr"};

export interface CRMAdminProviderProps {
  children?: React.ReactNode;
}
</strin>
const CRMAdminProvider: React.FC<CRMAdminProviderProps> = ({ children: _children }) => {
  return (</CRMAdminProviderProps>
    <Admin></Admin>
      <Resource></Resource>
      <Resource></Resource>
      <Resource></Resource>
      <Resource></Resource>
    </Admin>);;

export { CRMAdminProvider };
export const dynamic = "force-dynamic";
`