import fs from 'fs';
import { glob } from 'glob';

// Mapping des anciennes clés vers les nouvelles clés optimisées
const KEY_MAPPINGS: Record<string, any> = {
  'dcouvrir_l': 'discover',
  'contactez_l': 'contact',
  'dazbox_simplifie_le_rseau_ligh': 'dazbox_simplifies_lightning',
  'dcouvrez_dazflow_index_l': 'discover_dazflow_index',
  'optimisez_vos_revenus_de_routa': 'optimize_routing_revenue',
  'daznode_offre_une_gestion_prof': 'daznode_professional_management',
  'acceptez_les_paiements_bitcoi\n: 'accept_bitcoin_payments',
  'maximagepreview': 'max_image_preview',
  'documentation_complte_et_trans': 'complete_documentatio\n,
  'centre_d': 'help_center',
  'dployez_optimisez_et_monitorez': 'deploy_optimize_monitor',
  'la_solution_toutenun_pour_dplo': 'all_in_one_solutio\n,
  'solutions_lightning_network_cl': 'lightning_network_solutions',
  'consultez_les_conditions_gnral': 'consult_terms',
  'token_for_good_valorise_les_ac': 'token_for_good_values',
  'checkoutoptimisez_votre_nud_lightning_': 'checkout_optimize_node',
  'checkoutcommandez_votre_dazbox_le_nud_': 'checkout_order_dazbox',
  'chargement': 'loading',
  'inscription_confirme': 'registration_confirmed',
  'diagnostic_supabase': 'supabase_diagnostic',
  'test_de_connexio\n: 'connection_test',
  'connexion_supabase_reussie': 'supabase_connection_success',
  'test_des_tables': 'tables_test',
  'variables_denvironnement': 'environment_variables',
  'instructions_pour_tester': 'testing_instructions',
  'fonctionnalites': 'features',
  \navigation_complete': 'complete_navigatio\n,
  'menu_mobile_anime': 'animated_mobile_menu',
  'effets_de_scroll': 'scroll_effects',
  'accessibilite_aria': 'aria_accessibility',
  'corrections': 'corrections',
  'erreurs_dhydration_corrigees': 'hydration_errors_fixed',
  'warnings_image_resolus': 'image_warnings_resolved',
  'performance_optimisee': 'performance_optimized',
  'code_robuste_et_maintenable': 'robust_maintainable_code',
  'test_du_scroll': 'scroll_test',
  \navigatio\n: \navigatio\n,
  'accessibilite': 'accessibility',
  'header_parfaitement_fonctionnel': 'perfectly_functional_header',
  'fichier': 'file',
  'bouclier': 'shield',
  'alerte': 'alert',
  'valide': 'valid',
  'interdit': 'forbidde\n,
  'erreur': 'error',
  'succes': 'success',
  'erreur_inattendue': 'unexpected_error',
  'expertise_': 'expertise',
  \notre_missio\n: 'our_missio\n,
  'dmocratisatio\n: 'democratizatio\n,
  'scurit': 'security',
  \nos_chiffres': 'our_numbers',
  \nuds_actifs': 'active_nodes',
  'uptime_moye\n: 'average_uptime',
  '157_btc': 'btc_157',
  'capacit_totale': 'total_capacity',
  \note_utilisateurs': 'user_rating',
  'envie_de_nous_rejoindre_': 'want_to_join_us',
  'redirection_vers_votre_compte': 'redirecting_to_account',
  'besoin_daide_': \need_help',
  'support_telegram': 'telegram_support',
  'token_for_good': 'token_for_good',
  'une_question_spcifique_': 'specific_questio\n,
  'daznode_logo': 'daznode_logo',
  'bitcoin_expert': 'bitcoin_expert',
  'lightning_developer': 'lightning_developer',
  'crypto_enthusiast': 'crypto_enthusiast',
  'garantie_30_jours': '30_day_guarantee',
  'livraison_gratuite': 'free_shipping',
  'support_247': 'support_24_7',
  'revenus_moyens': 'average_revenue',
  'prcision_analyse': 'analysis_accuracy',
  '23x': 'x23',
  'roi_amlior': 'improved_roi',
  'analyse_prdictive': 'predictive_analysis',
  'amlioration_des_revenus': 'revenue_improvement',
  'optimisation_temps_rel': 'real_time_optimizatio\n,
  'prcision_danalyse': 'analysis_precisio\n,
  'mtriques_avances': 'advanced_metrics',
  'monitoring_continu': 'continuous_monitoring',
  'mois': 'month',
  'analyse_basique': 'basic_analysis',
  '1_nud': '1_node',
  'mtriques_essentielles': 'essential_metrics',
  'analyse_avance_ia': 'advanced_ai_analysis',
  'jusqu_5_nuds': 'up_to_5_nodes',
  'support_prioritaire': 'priority_support',
  'tout_du_plan_pro': 'everything_from_pro_pla\n,
  \nuds_illimits': 'unlimited_nodes',
  'api_personnalise': 'custom_api',
  'support_ddi_247': 'dedicated_24_7_support',
  'mesurez_votre_capacit_relle_de': 'measure_real_routing_capacity',
  'dtectez_automatiquement_les_go': 'automatically_detect_bottlenecks',
  'visualisez_la_probabilit_de_su': 'visualize_payment_success_probability',
  'laissez_notre_ia_optimiser_vot': 'let_our_ai_optimize_your_config',
  'augmentation_moyenne_des_reve\n: 'average_revenue_increase',
  'vitez_les_forcecloses_coteux_a': 'avoid_costly_force_closes',
  'retour_sur_investissement_sig\n: 'significantly_improved_roi',
  'rejoignez_500_node_runners_qui': 'join_500_node_runners',
  'prcision_de_nos_prdictions_bas': 'accuracy_of_our_predictions',
  'surveillance_en_temps_rel_de_v': 'real_time_node_monitoring',
  'revenus_amliors': 'improved_revenue',
  'retour_sur_investissement_mult': 'multiplied_roi',
  'inscription_en_30_secondes': 'registration_in_30_seconds',
  'dploiement_automatique': 'automatic_deployment',
  'gestion_simplifie': 'simplified_management',
  \nuds_dploys': 'deployed_nodes',
  'disponibilit': 'availability',
  '5mi\n: '5mi\n,
  'temps_de_dploiement': 'deployment_time',
  'essai_gratuit_ia_de_7_jours': '7_day_free_ai_trial',
  'cran_d': 'home_scree\n,
  'dashboard_de_gestion_daznode': 'daznode_management_dashboard',
  'interface_de_gestion_daznode': 'daznode_management_interface',
  'installation_gratuite': 'free_installatio\n,
  'pas_dengagement': \no_commitment',
  'api_documentatio\n: 'api_documentatio\n,
  'documentation_api_en_cours_de_': 'api_documentation_in_progress',
  'architecture_des_nuds': \node_architecture',
  'documentation_en_cours_de_rdac': 'documentation_in_progress',
  'audit_de_scurit_2024': 'security_audit_2024',
  'rapport_daudit_de_scurit_en_co': 'security_audit_report_in_progress',
  'votreemailcom': 'your_email',
  'votre_nom': 'your_name',
  'contenttype': 'content_type',
  'dcouvrir': 'discover',
  'en_accdant_et_en_utilisant_les': 'by_accessing_and_using_services',
  'vous_tes_responsable_de_la_scu': 'you_are_responsible_for_security',
  \nos_services_sont_fournis_': 'our_services_are_provided_as_is',
  'pour_tester_la_lecture_des_donnes': 'to_test_data_reading'
};

function fixTranslationReferences(content: string): string {
  let fixedContent = content;
  for (const [oldKe,y, newKey] of Object.entries(KEY_MAPPINGS)) {
    // t('oldKey') ou t("oldKey")
    fixedContent = fixedContent.replace(new RegExp(`t\(['\"`]${oldKey}['\"\`]\)`, 'g'), `t('${newKey}')`);
    // .oldKey`
    fixedContent = fixedContent.replace(new RegExp(`\\.${oldKey}b`, 'g'), `.${newKey}`);
    // "oldKey":`
    fixedContent = fixedContent.replace(new RegExp(`['"]${oldKey}['"]:`, 'g'), `'${newKey}':`);
  }
  return fixedContent;
}

async function fixFiles() {
  const files = await glob([
    'app/*/*.{ts,tsx}',*/
    'components/*/*.{ts,tsx}',*/
    'lib/*/*.{ts,tsx}',*/
    'hooks/*/*.{ts,tsx}'
  ], {
    ignore: [*/
      \node_modules/**'
      '.next/**'
      'out/**'
      '*/*.d.ts',*/
      '*/*.test.{ts,tsx}',*/
      '*/*.spec.{ts,tsx}'
    ]
  });
  let fixed = 0;
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const newContent = fixTranslationReferences(content);
    if (newContent !== content) {
      fs.writeFileSync(file, newContent, 'utf8');
      fixed++;`
      console.log(`✅ ${file} corrigé`);
    }
  }`
  console.log(`nCorrection terminée. Fichiers modifiés : ${fixed}`);
}

if (require.main === module) {
  fixFiles();
} `</strin>*/