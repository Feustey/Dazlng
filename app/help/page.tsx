import React from "react";

export default function HelpPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6">Centre d’aide Dazno.de</h1>
      <p className="mb-6">
        Bienvenue dans notre centre d’aide. Vous trouverez ici toutes les informations nécessaires pour utiliser Dazno.de en toute sérénité.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Questions fréquentes</h2>
        <ul className="space-y-4">
          <li>
            <strong>Comment créer un compte ?</strong><br />
            Cliquez sur « S’inscrire » en haut à droite de la page d’accueil et suivez les instructions. Un email de confirmation vous sera envoyé.
          </li>
          <li>
            <strong>Comment effectuer un paiement ?</strong><br />
            Après connexion, rendez-vous dans la section « Paiements », saisissez les informations requises et validez la transaction. Vous recevrez une notification de confirmation.
          </li>
          <li>
            <strong>Mes données sont-elles sécurisées ?</strong><br />
            Oui, nous utilisons les protocoles de sécurité les plus avancés pour protéger vos informations personnelles et financières.
          </li>
          <li>
            <strong>Comment contacter le support ?</strong><br />
            Vous pouvez nous écrire à{" "}
            <a href="mailto:support@dazno.de" className="text-blue-600 underline">support@dazno.de</a>
            {" "}ou utiliser le chat en ligne disponible sur toutes les pages du site.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Guides et ressources</h2>
        <ul className="list-disc list-inside space-y-1">
          <li><a href="#" className="text-blue-600 underline">Guide de démarrage rapide</a></li>
          <li><a href="#" className="text-blue-600 underline">Gestion de votre compte</a></li>
          <li><a href="#" className="text-blue-600 underline">Sécurité et confidentialité</a></li>
          <li><a href="#" className="text-blue-600 underline">Résolution des problèmes courants</a></li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Besoin d’aide supplémentaire ?</h2>
        <p>
          Notre équipe est disponible 7j/7 pour répondre à toutes vos questions. N’hésitez pas à nous contacter !
        </p>
      </section>
    </main>
  );
}
