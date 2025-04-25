export async function getMessages(locale: string = "en") {
  // Fonction simplifiée pour récupérer les messages de traduction
  try {
    // Dans une implémentation réelle, on pourrait charger dynamiquement les fichiers de traduction
    // ou les récupérer depuis une API
    return {
      // Message par défaut
      common: {
        welcome: "Bienvenue",
        login: "Connexion",
        register: "Inscription",
        logout: "Déconnexion",
      },
      // Messages spécifiques au checkout
      checkout: {
        step1: "Panier",
        step2: "Livraison",
        step3: "Paiement",
        step4: "Confirmation",
        next: "Suivant",
        previous: "Précédent",
        total: "Total",
      },
    };
  } catch (error) {
    console.error("Erreur lors du chargement des messages:", error);
    return {};
  }
}
