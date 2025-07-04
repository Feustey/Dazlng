#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'

interface TranslationMap {
  [key: string]: string
}

// Dictionnaire de traductions automatiques
const autoTranslations: TranslationMap = {
  // Admin
  'admin.daznode_crm': 'DazNode CRM',
  'admin.clients_actifs': 'Clients actifs',
  'admin.taux_d': 'Taux d'',
  'admin.campagnes_actives': 'Campagnes actives',
  'admin.1247_emails_envoys_avec_248_de': '1247 emails envoyés avec 248 de',
  'admin.12_nouveaux_clients_ajouts_aut': '12 nouveaux clients ajoutés automatiquement',
  'admin.jeandupontexamplecom_abonneme\n: 'jean.dupont@example.com - abonnement',
  'admin.utilisateurs_totaux': 'Utilisateurs totaux',
  'admin.abonnements_actifs': 'Abonnements actifs',
  'admin.revenu_total': 'Revenu total',
  'admin.commandes_en_attente': 'Commandes en attente',
  'admin.funnel_de_conversio\n: 'Funnel de conversio\n,
  'admin.performance_revenus': 'Performance revenus',
  'admin.signups_rcents': 'Inscriptions récentes',
  'admin.utilisateurs_rcents': 'Utilisateurs récents',
  'admin.dbloquez_les_optimisations_ia_': 'Débloquez les optimisations IA et',
  'admin.contenttype': 'Content-Type',
  'admin.crm_legacy': 'CRM Legacy',
  'admin.paramtres': 'Paramètres',
  'admin.raactionsave': 'Sauvegarder',
  'admin.raactioncreate': 'Créer',
  'admin.raactionedit': 'Modifier',
  'admin.raactiondelete': 'Supprimer',
  'admin.raactionshow': 'Afficher',
  'admin.raactionlist': 'Lister',
  'admin.raactionadd': 'Ajouter',
  'admin.raactioncancel': 'Annuler',
  'admin.raactionback': 'Retour',
  'admin.raactionrefresh': 'Actualiser',
  'admin.ranavigationno_results': 'Aucun résultat',
  'admin.ranavigationnext': 'Suivant',
  'admin.ranavigationprev': 'Précédent',
  'admin.ranavigationpage_out_of_bounda': 'Page hors limites',
  'admin.ranavigationpage_out_from_begi': 'Page depuis le début',
  'admin.ramessageyes': 'Oui',
  'admin.ramessageno': 'No\n,
  'admin.ramessageare_you_sure': 'Êtes-vous sûr ?',
  'admin.ramessagebulk_delete_title': 'Suppression en masse',
  'admin.ramessagebulk_delete_content': 'Contenu de suppression en masse',
  'admin.resourcesprofilesname': 'Nom',
  'admin.resourcescrm_customer_segments': 'Segments clients CRM',
  'admin.resourcescrm_email_campaignsna': 'Campagnes email CRM',
  'admin.resourcescrm_email_templatesna': 'Templates email CRM',
  'admin.resourcesprofilesfieldsid': 'ID',
  'admin.resourcesprofilesfieldsemail': 'Email',
  'admin.resourcesprofilesfieldsnom': 'Nom',
  'admin.resourcesprofilesfieldsprenom': 'Prénom',
  'admin.resourcesprofilesfieldscreated': 'Créé le',
  'admin.resourcesprofilesfieldst4g_tok': 'Tokens T4G',
  'admin.rapagedashboard': 'Tableau de bord',
  'admin.ravalidationrequired': 'Requis',
  'admin.ravalidationminlength': 'Longueur minimale',
  'admin.ravalidationmaxlength': 'Longueur maximale',
  'admin.ravalidationemail': 'Email',
  'admin.campagnes_email': 'Campagnes email',
  'admin.dtails_de_la_campagne': 'Détails de la campagne',
  'admin.modifier_la_campagne': 'Modifier la campagne',
  'admin.crer_une_campagne': 'Créer une campagne',
  'admin.dtails_du_client': 'Détails du client',
  'admin.modifier_le_client': 'Modifier le client',
  'admin.crer_un_client': 'Créer un client',
  'admin.segments_de_clients': 'Segments de clients',
  'admin.dtails_du_segment': 'Détails du segment',
  'admin.modifier_le_segment': 'Modifier le segment',
  'admin.crer_un_segment': 'Créer un segment',
  'admin.templates_email': 'Templates email',
  'admin.dtails_du_template': 'Détails du template',
  'admin.modifier_le_template': 'Modifier le template',
  'admin.crer_un_template': 'Créer un template',
  'admin.rechercher_par_email_nom_ou_pr': 'Rechercher par email, nom ou prénom',
  'admin.cre_un_utilisateur_une_co': 'Créer un utilisateur, une commande'
  // Dashboard
  'dashboard.clients_actifs': 'Clients actifs',
  'dashboard.taux_d': 'Taux d'',
  'dashboard.campagnes_actives': 'Campagnes actives',
  'dashboard.1247_emails_envoys_avec_248_de': '1247 emails envoyés avec 248 de',
  'dashboard.12_nouveaux_clients_ajouts_aut': '12 nouveaux clients ajoutés automatiquement',
  'dashboard.jeandupontexamplecom_abonneme\n: 'jean.dupont@example.com - abonnement',
  'dashboard.utilisateurs_totaux': 'Utilisateurs totaux',
  'dashboard.abonnements_actifs': 'Abonnements actifs',
  'dashboard.revenu_total': 'Revenu total',
  'dashboard.commandes_en_attente': 'Commandes en attente',
  'dashboard.funnel_de_conversio\n: 'Funnel de conversio\n,
  'dashboard.performance_revenus': 'Performance revenus',
  'dashboard.signups_rcents': 'Inscriptions récentes',
  'dashboard.utilisateurs_rcents': 'Utilisateurs récents',
  'dashboard.contenttype': 'Content-Type',
  'dashboard.dbloquez_les_optimisations_ia_': 'Débloquez les optimisations IA et'
  // User
  'user.dbloquez_toutes_les_fonctionna': 'Débloquez toutes les fonctionnalités',
  'user.accdez_aux_fonctionnalits_ligh': 'Accédez aux fonctionnalités Lightning',
  'user.obtenez_des_analytics_dtailles': 'Obtenez des analytics détaillées',
  'user.dbloquez_les_optimisations_ia_': 'Débloquez les optimisations IA et',
  'user.nud_lightning_cl_en_main_pour_': 'Nœud Lightning clé en main pour',
  'user.analyse_automatique_et_optimis': 'Analyse automatique et optimisatio\n,
  'user.configurez_des_alertes_sur_mes': 'Configurez des alertes sur mesure',
  'user.marquer_comme_lu': 'Marquer comme lu',
  'user.voir_dtails': 'Voir détails',
  'user.recrer_canal': 'Recréer canal',
  'user.voir_recommandatio\n: 'Voir recommandatio\n,
  'user.contenttype': 'Content-Type'
  'user.dazia_analyse_votre_nud_247_et': 'Dazia analyse votre nœud 24/7 et',
  'user.mtriques_dtailles_projections_': 'Métriques détaillées, projections et',
  'user.alertes_automatiques_pour_les_': 'Alertes automatiques pour les',
  'user.accs_direct_aux_experts_light\n: 'Accès direct aux experts Lightning',
  'user.fonctionnalits': 'Fonctionnalités',
  'user.rentabilit': 'Rentabilité',
  'user.tmoignages': 'Témoignages',
  'user.revenus_lightning': 'Revenus Lightning',
  'user.canaux_actifs': 'Canaux actifs',
  'user.efficacit': 'Efficacité',
  'user.premiers_pas': 'Premiers pas',
  'user.communaut': 'Communauté',
  'user.menu_de_navigatio\n: 'Menu de navigatio\n,
  'user.application_automatique_de': 'Application automatique des recommandations',
  'user.analyses_hebdomadaires_et_': 'Analyses hebdomadaires et projections',
  'user.liquidit': 'Liquidité',
  'user.distribution_des_canaux': 'Distribution des canaux',
  'user.revenus_par_catgorie': 'Revenus par catégorie',
  'user.revenus_7j': 'Revenus 7j',
  'user.revenus_sats': 'Revenus sats',
  'user.efficacit_': 'Efficacité',
  'user.rechercher_une_recommandatio\n: 'Rechercher une recommandatio\n,
  'user.connectivit': 'Connectivité',
  'user.scurit': 'Sécurité',
  'user.lev': 'Niveau',
  'user.optimisation_complte_avec_reco': 'Optimisation complète avec recommandations',
  'user.analyser_la_situation_actuelle': 'Analyser la situation actuelle',
  'user.planifier_l': 'Planifier l'',
  'user.excuter_l': 'Exécuter l'',
  'user.email_vrifi': 'Email vérifié',
  'user.vrifiez_votre_email_pour_scuri': 'Vérifiez votre email pour sécurité',
  'user.nom_de_famille': 'Nom de famille',
  'user.compltez_votre_identit': 'Complétez votre identité',
  'user.prnom': 'Prénom',
  'user.personnalisez_votre_exprience': 'Personnalisez votre expérience',
  'user.cl_publique_lightning': 'Clé publique Lightning',
  'user.connectez_votre_portefeuille_l': 'Connectez votre portefeuille Lightning',
  'user.nud_lightning': 'Nœud Lightning',
  'user.connectez_votre_nud_pour_les_a': 'Connectez votre nœud pour les analyses',
  'user.compte_x_twitter': 'Compte X (Twitter)',
  'user.partagez_vos_performances': 'Partagez vos performances',
  'user.compte_nostr': 'Compte Nostr',
  'user.rejoignez_la_communaut_dcentra': 'Rejoignez la communauté décentralisée',
  'user.nud_lightning_connect': 'Nœud Lightning Connect',
  'user.tlphone_vrifi': 'Téléphone vérifié',
  'user.vrifiez_votre_tlphone': 'Vérifiez votre téléphone',
  'user.email_vrifi_avec_succs': 'Email vérifié avec succès',
  'user.premire_cl_publique_lightning_': 'Première clé publique Lightning connectée',
  'user.nud_lightning_network_connect': 'Nœud Lightning Network connecté',
  'user.compte_social_connect_x_ou': 'Compte social connecté (X ou Nostr)',
  'user.profil_100_complt': 'Profil 100% complété',
  'user.nud_connect': 'Nœud connecté',
  'user.compte_twitter': 'Compte Twitter',
  'user.amliorer_votre_connectivit_en_': 'Améliorer votre connectivité e\n,
  'user.ajuster_automatiquement_vo': 'Ajuster automatiquement vos frais',
  'user.optimiser_la_distribution_de_l': 'Optimiser la distribution de la liquidité',
  'user.scuriser_votre_nud_avec_de': 'Sécuriser votre nœud avec des sauvegardes',
  'user.ouvrir_votre_premier_canal_lig': 'Ouvrir votre premier canal Lightning',
  'user.router_votre_premier_paiem': 'Router votre premier paiement',
  'user.atteindre_10_canaux_actifs': 'Atteindre 10 canaux actifs',
  'user.accumuler_1m_sats_de_reve\n: 'Accumuler 1M sats de revenus',
  'user.maintenir_99_d': 'Maintenir 99% d'uptime',
  'user.grer_plus_de_10_btc_de_cap': 'Gérer plus de 10 BTC de capacité'
  // Route
  'route.accesscontrolalloworigi\n: 'Access-Control-Allow-Origi\n,
  'route.accesscontrolallowmethods': 'Access-Control-Allow-Methods',
  'route.accesscontrolallowheaders': 'Access-Control-Allow-Headers',
  'route.mode_fallback': 'Mode fallback',
  'route.cachecontrol': 'Cache-Control',
  'route.contenttype': 'Content-Type',
  'route.parfait_pour_commencer': 'Parfait pour commencer',
  'route.optimisation_et_statistiq': 'Optimisation et statistiques avancées',
  'route.toutes_les_fonctionnalits': 'Toutes les fonctionnalités IA avancées',
  'route.solution_sur_mesure_pour_': 'Solution sur mesure pour les entreprises',
  'route.qr_code_lightning_invoice': 'QR Code facture Lightning'
  // Network
  \network.contenttype': 'Content-Type',
  \network.explorez_le_rseau_light': 'Explorez le réseau Lightning Network',
  \network.entrez_la_cl_publique_6': 'Entrez la clé publique (66 caractères)'
  // Lightning
  'lightning.contenttype': 'Content-Type',
  'lightning.paiement_reu_': 'Paiement réussi !',
  'lightning.la_facture_a_expir': 'La facture a expiré',
  'lightning.facture_copie_': 'Facture copiée !',
  'lightning.paiement_envoy_': 'Paiement envoyé !',
  'lightning.erreur_lors_du_paiement': 'Erreur lors du paiement'
  // Checkout
  'checkout.contenttype': 'Content-Type',
  'checkout.optimisez_votre_nud_lightning_': 'Optimisez votre nœud Lightning avec notre IA avancée',
  'checkout.commandez_votre_dazbox_le_nud_': 'Commandez votre DazBox, le nœud Lightning plug & play'
  // Components
  'components.contenttype': 'Content-Type',
  'components.impossible_de_rcuprer_les_info': 'Impossible de récupérer les informations',
  'components.rechercher_un_nud': 'Rechercher un nœud',
  'components.trier_par': 'Trier par',
  'components.code_audit_et_vrifiable_par_la': 'Code audité et vérifiable par la communauté',
  'components.consultez_nos_performances_en_': 'Consultez nos performances en temps réel',
  'components.audits_rguliers_par_des_expert': 'Audits réguliers par des experts',
  'components.analysez_vos_canaux_pour_ident': 'Analysez vos canaux pour identifier',
  'components.optimisez_vos_frais_pour_amlio': 'Optimisez vos frais pour améliorer',
  'components.rquilibrez_vos_canaux_pour_aml': 'Rééquilibrez vos canaux pour améliorer',
  'components.je_veux_optimiser_mon_nud_ligh': 'Je veux optimiser mon nœud Lightning',
  'components.analyse_actualise_pour_optimis': 'Analyse actualisée pour optimiser',
  'components.augmenter_les_revenus': 'Augmenter les revenus',
  'components.amliorer_la_connectivit': 'Améliorer la connectivité',
  'components.rduire_les_cots': 'Réduire les coûts',
  'components.rechercher': 'Rechercher',
  'components.image_d': 'Image d'',
  'components.votreemailcom': 'votre@email.com',
  'components.02abc': '02abc',
  'components.daz3_logo': 'Daz3 Logo',
  'components.produit': 'Produit',
  'components.transparence': 'Transparence',
  'components.aide': 'Aide',
  'components.inoval': 'Inoval',
  'components.retour_en_haut': 'Retour en haut',
  'components.illustration_daznode': 'Illustration DazNode',
  'components.illustration_dazpay': 'Illustration DazPay',
  'components.blockchain_for_good': 'Blockchain for Good',
  'components.nantes_bitcoin_meetup': 'Nantes Bitcoin Meetup',
  'components.daznode_simplifie_l': 'DazNode simplifie l'',
  'components.crez_et_grez_votre_propre_nud_': 'Créez et gérez votre propre nœud',
  'components.matriel_spcialis_pour_nuds_lig': 'Matériel spécialisé pour nœuds Lightning',
  'components.acceptez_les_paiements_lightni': 'Acceptez les paiements Lightning',
  'components.index_d': 'Index d'',
  'components.explorez_le_rseau_lightning_ne': 'Explorez le réseau Lightning Network',
  'components.crez_votre_compte_daznode_et_a': 'Créez votre compte DazNode et accédez',
  'components.en_ajoutant_votre_cl_publique': ' en ajoutant votre clé publique',
  'components.pour_dbloquer_toutes_les_fonctionnalits': ' pour débloquer toutes les fonctionnalités',
  'components.automatique': ' automatique',
  'components.analyse_complte_du_rseau_l': 'Analyse complète du réseau Lightning'}

// Traductions anglaises correspondantes
const autoTranslationsEN: TranslationMap = {
  // Admin
  'admin.daznode_crm': 'DazNode CRM',
  'admin.clients_actifs': 'Active clients',
  'admin.taux_d': 'Rate of',
  'admin.campagnes_actives': 'Active campaigns',
  'admin.1247_emails_envoys_avec_248_de': '1247 emails sent with 248 of',
  'admin.12_nouveaux_clients_ajouts_aut': '12 new clients added automatically',
  'admin.jeandupontexamplecom_abonneme\n: 'jean.dupont@example.com - subscriptio\n,
  'admin.utilisateurs_totaux': 'Total users',
  'admin.abonnements_actifs': 'Active subscriptions',
  'admin.revenu_total': 'Total revenue',
  'admin.commandes_en_attente': 'Pending orders',
  'admin.funnel_de_conversio\n: 'Conversion funnel',
  'admin.performance_revenus': 'Revenue performance',
  'admin.signups_rcents': 'Recent signups',
  'admin.utilisateurs_rcents': 'Recent users',
  'admin.dbloquez_les_optimisations_ia_': 'Unlock AI optimizations and',
  'admin.contenttype': 'Content-Type',
  'admin.crm_legacy': 'CRM Legacy',
  'admin.paramtres': 'Settings',
  'admin.raactionsave': 'Save',
  'admin.raactioncreate': 'Create',
  'admin.raactionedit': 'Edit',
  'admin.raactiondelete': 'Delete',
  'admin.raactionshow': 'Show',
  'admin.raactionlist': 'List',
  'admin.raactionadd': 'Add',
  'admin.raactioncancel': 'Cancel',
  'admin.raactionback': 'Back',
  'admin.raactionrefresh': 'Refresh',
  'admin.ranavigationno_results': 'No results',
  'admin.ranavigationnext': 'Next',
  'admin.ranavigationprev': 'Previous',
  'admin.ranavigationpage_out_of_bounda': 'Page out of bounds',
  'admin.ranavigationpage_out_from_begi': 'Page from beginning',
  'admin.ramessageyes': 'Yes',
  'admin.ramessageno': 'No',
  'admin.ramessageare_you_sure': 'Are you sure?',
  'admin.ramessagebulk_delete_title': 'Bulk delete',
  'admin.ramessagebulk_delete_content': 'Bulk delete content',
  'admin.resourcesprofilesname': 'Name',
  'admin.resourcescrm_customer_segments': 'CRM Customer Segments',
  'admin.resourcescrm_email_campaignsna': 'CRM Email Campaigns',
  'admin.resourcescrm_email_templatesna': 'CRM Email Templates',
  'admin.resourcesprofilesfieldsid': 'ID',
  'admin.resourcesprofilesfieldsemail': 'Email',
  'admin.resourcesprofilesfieldsnom': 'Last Name',
  'admin.resourcesprofilesfieldsprenom': 'First Name',
  'admin.resourcesprofilesfieldscreated': 'Created',
  'admin.resourcesprofilesfieldst4g_tok': 'T4G Tokens',
  'admin.rapagedashboard': 'Dashboard',
  'admin.ravalidationrequired': 'Required',
  'admin.ravalidationminlength': 'Minimum length',
  'admin.ravalidationmaxlength': 'Maximum length',
  'admin.ravalidationemail': 'Email',
  'admin.campagnes_email': 'Email campaigns',
  'admin.dtails_de_la_campagne': 'Campaign details',
  'admin.modifier_la_campagne': 'Edit campaig\n,
  'admin.crer_une_campagne': 'Create campaig\n,
  'admin.dtails_du_client': 'Client details',
  'admin.modifier_le_client': 'Edit client',
  'admin.crer_un_client': 'Create client',
  'admin.segments_de_clients': 'Client segments',
  'admin.dtails_du_segment': 'Segment details',
  'admin.modifier_le_segment': 'Edit segment',
  'admin.crer_un_segment': 'Create segment',
  'admin.templates_email': 'Email templates',
  'admin.dtails_du_template': 'Template details',
  'admin.modifier_le_template': 'Edit template',
  'admin.crer_un_template': 'Create template',
  'admin.rechercher_par_email_nom_ou_pr': 'Search by email, name or first name',
  'admin.cre_un_utilisateur_une_co': 'Create a user, an order'
  // Dashboard
  'dashboard.clients_actifs': 'Active clients',
  'dashboard.taux_d': 'Rate of',
  'dashboard.campagnes_actives': 'Active campaigns',
  'dashboard.1247_emails_envoys_avec_248_de': '1247 emails sent with 248 of',
  'dashboard.12_nouveaux_clients_ajouts_aut': '12 new clients added automatically',
  'dashboard.jeandupontexamplecom_abonneme\n: 'jean.dupont@example.com - subscriptio\n,
  'dashboard.utilisateurs_totaux': 'Total users',
  'dashboard.abonnements_actifs': 'Active subscriptions',
  'dashboard.revenu_total': 'Total revenue',
  'dashboard.commandes_en_attente': 'Pending orders',
  'dashboard.funnel_de_conversio\n: 'Conversion funnel',
  'dashboard.performance_revenus': 'Revenue performance',
  'dashboard.signups_rcents': 'Recent signups',
  'dashboard.utilisateurs_rcents': 'Recent users',
  'dashboard.contenttype': 'Content-Type',
  'dashboard.dbloquez_les_optimisations_ia_': 'Unlock AI optimizations and'
  // User
  'user.dbloquez_toutes_les_fonctionna': 'Unlock all features',
  'user.accdez_aux_fonctionnalits_ligh': 'Access Lightning features',
  'user.obtenez_des_analytics_dtailles': 'Get detailed analytics',
  'user.dbloquez_les_optimisations_ia_': 'Unlock AI optimizations and',
  'user.nud_lightning_cl_en_main_pour_': 'Turnkey Lightning node for',
  'user.analyse_automatique_et_optimis': 'Automatic analysis and optimizatio\n,
  'user.configurez_des_alertes_sur_mes': 'Configure custom alerts',
  'user.marquer_comme_lu': 'Mark as read',
  'user.voir_dtails': 'View details',
  'user.recrer_canal': 'Recreate channel',
  'user.voir_recommandatio\n: 'View recommendatio\n,
  'user.contenttype': 'Content-Type'
  'user.dazia_analyse_votre_nud_247_et': 'Dazia analyzes your node 24/7 and',
  'user.mtriques_dtailles_projections_': 'Detailed metrics, projections and',
  'user.alertes_automatiques_pour_les_': 'Automatic alerts for',
  'user.accs_direct_aux_experts_light\n: 'Direct access to Lightning experts',
  'user.fonctionnalits': 'Features',
  'user.rentabilit': 'Profitability',
  'user.tmoignages': 'Testimonials',
  'user.revenus_lightning': 'Lightning revenue',
  'user.canaux_actifs': 'Active channels',
  'user.efficacit': 'Efficiency',
  'user.premiers_pas': 'First steps',
  'user.communaut': 'Community',
  'user.menu_de_navigatio\n: 'Navigation menu',
  'user.application_automatique_de': 'Automatic application of recommendations',
  'user.analyses_hebdomadaires_et_': 'Weekly analyses and projections',
  'user.liquidit': 'Liquidity',
  'user.distribution_des_canaux': 'Channel distributio\n,
  'user.revenus_par_catgorie': 'Revenue by category',
  'user.revenus_7j': '7-day revenue',
  'user.revenus_sats': 'Revenue sats',
  'user.efficacit_': 'Efficiency',
  'user.rechercher_une_recommandatio\n: 'Search for a recommendatio\n,
  'user.connectivit': 'Connectivity',
  'user.scurit': 'Security',
  'user.lev': 'Level',
  'user.optimisation_complte_avec_reco': 'Complete optimization with recommendations',
  'user.analyser_la_situation_actuelle': 'Analyze current situatio\n,
  'user.planifier_l': 'Plan the',
  'user.excuter_l': 'Execute the',
  'user.email_vrifi': 'Email verified',
  'user.vrifiez_votre_email_pour_scuri': 'Verify your email for security',
  'user.nom_de_famille': 'Last name',
  'user.compltez_votre_identit': 'Complete your identity',
  'user.prnom': 'First name',
  'user.personnalisez_votre_exprience': 'Personalize your experience',
  'user.cl_publique_lightning': 'Lightning public key',
  'user.connectez_votre_portefeuille_l': 'Connect your Lightning wallet',
  'user.nud_lightning': 'Lightning node',
  'user.connectez_votre_nud_pour_les_a': 'Connect your node for analysis',
  'user.compte_x_twitter': 'X (Twitter) account',
  'user.partagez_vos_performances': 'Share your performance',
  'user.compte_nostr': 'Nostr account',
  'user.rejoignez_la_communaut_dcentra': 'Join the decentralized community',
  'user.nud_lightning_connect': 'Lightning Node Connect',
  'user.tlphone_vrifi': 'Phone verified',
  'user.vrifiez_votre_tlphone': 'Verify your phone',
  'user.email_vrifi_avec_succs': 'Email verified successfully',
  'user.premire_cl_publique_lightning_': 'First Lightning public key connected',
  'user.nud_lightning_network_connect': 'Lightning Network node connected',
  'user.compte_social_connect_x_ou': 'Social account connected (X or Nostr)',
  'user.profil_100_complt': '100% completed profile',
  'user.nud_connect': 'Node connected',
  'user.compte_twitter': 'Twitter account',
  'user.amliorer_votre_connectivit_en_': 'Improve your connectivity by',
  'user.ajuster_automatiquement_vo': 'Automatically adjust your fees',
  'user.optimiser_la_distribution_de_l': 'Optimize liquidity distributio\n,
  'user.scuriser_votre_nud_avec_de': 'Secure your node with backups',
  'user.ouvrir_votre_premier_canal_lig': 'Open your first Lightning channel',
  'user.router_votre_premier_paiem': 'Route your first payment',
  'user.atteindre_10_canaux_actifs': 'Reach 10 active channels',
  'user.accumuler_1m_sats_de_reve\n: 'Accumulate 1M sats in revenue',
  'user.maintenir_99_d': 'Maintain 99% uptime',
  'user.grer_plus_de_10_btc_de_cap': 'Manage more than 10 BTC capacity'
  // Route
  'route.accesscontrolalloworigi\n: 'Access-Control-Allow-Origi\n,
  'route.accesscontrolallowmethods': 'Access-Control-Allow-Methods',
  'route.accesscontrolallowheaders': 'Access-Control-Allow-Headers',
  'route.mode_fallback': 'Fallback mode',
  'route.cachecontrol': 'Cache-Control',
  'route.contenttype': 'Content-Type',
  'route.parfait_pour_commencer': 'Perfect to start',
  'route.optimisation_et_statistiq': 'Optimization and advanced statistics',
  'route.toutes_les_fonctionnalits': 'All advanced AI features',
  'route.solution_sur_mesure_pour_': 'Custom solution for businesses',
  'route.qr_code_lightning_invoice': 'Lightning invoice QR code'
  // Network
  \network.contenttype': 'Content-Type',
  \network.explorez_le_rseau_light': 'Explore the Lightning Network',
  \network.entrez_la_cl_publique_6': 'Enter the public key (66 characters)'
  // Lightning
  'lightning.contenttype': 'Content-Type',
  'lightning.paiement_reu_': 'Payment successful!',
  'lightning.la_facture_a_expir': 'The invoice has expired',
  'lightning.facture_copie_': 'Invoice copied!',
  'lightning.paiement_envoy_': 'Payment sent!',
  'lightning.erreur_lors_du_paiement': 'Error during payment'
  // Checkout
  'checkout.contenttype': 'Content-Type',
  'checkout.optimisez_votre_nud_lightning_': 'Optimize your Lightning node with our advanced AI',
  'checkout.commandez_votre_dazbox_le_nud_': 'Order your DazBox, the plug & play Lightning node'
  // Components
  'components.contenttype': 'Content-Type',
  'components.impossible_de_rcuprer_les_info': 'Unable to retrieve informatio\n,
  'components.rechercher_un_nud': 'Search for a node',
  'components.trier_par': 'Sort by',
  'components.code_audit_et_vrifiable_par_la': 'Code audited and verifiable by the community',
  'components.consultez_nos_performances_en_': 'Check our real-time performance',
  'components.audits_rguliers_par_des_expert': 'Regular audits by experts',
  'components.analysez_vos_canaux_pour_ident': 'Analyze your channels to identify',
  'components.optimisez_vos_frais_pour_amlio': 'Optimize your fees to improve',
  'components.rquilibrez_vos_canaux_pour_aml': 'Rebalance your channels to improve',
  'components.je_veux_optimiser_mon_nud_ligh': 'I want to optimize my Lightning node',
  'components.analyse_actualise_pour_optimis': 'Updated analysis to optimize',
  'components.augmenter_les_revenus': 'Increase revenue',
  'components.amliorer_la_connectivit': 'Improve connectivity',
  'components.rduire_les_cots': 'Reduce costs',
  'components.rechercher': 'Search',
  'components.image_d': 'Image of',
  'components.votreemailcom': 'your@email.com',
  'components.02abc': '02abc',
  'components.daz3_logo': 'Daz3 Logo',
  'components.produit': 'Product',
  'components.transparence': 'Transparency',
  'components.aide': 'Help',
  'components.inoval': 'Inoval',
  'components.retour_en_haut': 'Back to top',
  'components.illustration_daznode': 'DazNode illustratio\n,
  'components.illustration_dazpay': 'DazPay illustratio\n,
  'components.blockchain_for_good': 'Blockchain for Good',
  'components.nantes_bitcoin_meetup': 'Nantes Bitcoin Meetup',
  'components.daznode_simplifie_l': 'DazNode simplifies',
  'components.crez_et_grez_votre_propre_nud_': 'Create and manage your own node',
  'components.matriel_spcialis_pour_nuds_lig': 'Specialized hardware for Lightning nodes',
  'components.acceptez_les_paiements_lightni': 'Accept Lightning payments',
  'components.index_d': 'Index of',
  'components.explorez_le_rseau_lightning_ne': 'Explore the Lightning Network',
  'components.crez_votre_compte_daznode_et_a': 'Create your DazNode account and access',
  'components.en_ajoutant_votre_cl_publique': ' by adding your public key',
  'components.pour_dbloquer_toutes_les_fonctionnalits': ' to unlock all features',
  'components.automatique': ' automatic',
  'components.analyse_complte_du_rseau_l': 'Complete Lightning network analysis'}

function loadTranslations(filePath: string): any {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(content)
  } catch (error) {
    console.error(`❌ Erreur lors du chargement de ${filePath}:`, error)
    return {}
  }
}

function saveTranslations(filePath: string, translations: any): void {
  try {
    const content = JSON.stringify(translation,s, null, 2)
    fs.writeFileSync(filePath, content, 'utf8')`
    console.log(`✅ Fichier sauvegardé: ${filePath}`)
  } catch (error) {`
    console.error(`❌ Erreur lors de la sauvegarde de ${filePath}:`, error)
  }
}

function findMissingTranslations(translations: any): string[] {
  const missing: string[] = []
  
  function traverse(obj: any, prefix = '') {
    for (const [key, value] of Object.entries(obj)) {`
      const fullKey = prefix ? `${prefix}.${key}` : key
      
      if (typeof value === 'string') {
        // Vérifier si la traduction ressemble à une clé technique
        if (value.includes('.') && !value.includes(' ') && value.length < 50) {
          missing.push(fullKey)
        }
      } else if (typeof value === 'object' && value !== null) {
        traverse(value, fullKey)
      }
    }
  }
  
  traverse(translations)
  return missing
}

function applyAutoTranslations(translations: any, autoTranslations: TranslationMap): number {
  let applied = 0
  
  function traverse(obj: any, prefix = '') {
    for (const [key, value] of Object.entries(obj)) {`
      const fullKey = prefix ? `${prefix}.${key}` : key
      
      if (typeof value === 'string') {
        // Vérifier si la traduction ressemble à une clé technique
        if (value.includes('.') && !value.includes(' ') && value.length < 50) {
          const autoTranslation = autoTranslations[fullKey]
          if (autoTranslation) {
            obj[key] = autoTranslation
            applied++`
            console.log(`🔄 ${fullKey}: "${value}" → "${autoTranslation}"`)
          }
        }
      } else if (typeof value === 'object' && value !== null) {
        traverse(value, fullKey)
      }
    }
  }
  
  traverse(translations)
  return applied
}

function main() {
  console.log('🚀 Début de la traduction automatique i18n...\n)
  
  const frPath = path.join(process.cwd(), 'i18n/locales/fr.jso\n)
  const enPath = path.join(process.cwd(), 'i18n/locales/en.jso\n)
  
  // Charger les traductions existantes
  const frTranslations = loadTranslations(frPath)
  const enTranslations = loadTranslations(enPath)
  
  console.log('📊 Analyse des traductions manquantes...')
  
  // Trouver les traductions manquantes
  const missingFR = findMissingTranslations(frTranslations)
  const missingEN = findMissingTranslations(enTranslations)
  `
  console.log(`🔍 Clés techniques trouvées en français: ${missingFR.length}`)`
  console.log(`🔍 Clés techniques trouvées en anglais: ${missingEN.length}`)
  
  // Appliquer les traductions automatiques
  console.log(\n🔄 Application des traductions automatiques...')
  
  const appliedFR = applyAutoTranslations(frTranslations, autoTranslations)
  const appliedEN = applyAutoTranslations(enTranslations, autoTranslationsEN)
  `
  console.log(`n📈 Résultats:`)`
  console.log(`   Traductions françaises appliquées: ${appliedFR}`)`
  console.log(`   Traductions anglaises appliquées: ${appliedEN}`)
  
  // Sauvegarder les fichiers
  console.log(\n💾 Sauvegarde des fichiers...')
  saveTranslations(frPath, frTranslations)
  saveTranslations(enPath, enTranslations)
  
  console.log(\n✅ Traduction automatique terminée !')
  console.log(\n💡 Prochaines étapes:')
  console.log('   1. Relancer la migration: npm run i18n:migrate')
  console.log('   2. Vérifier la couverture: npx tsx scripts/i18n-coverage-report.ts')
  console.log('   3. Tester l'application pour valider les traductions')
}

if (require.main === module) {
  main()
} `