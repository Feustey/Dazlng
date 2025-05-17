import React from "react";

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6">À propos de Dazno.de</h1>
      <p className="mb-6">
        Bienvenue sur <strong>Dazno.de</strong>, la plateforme innovante dédiée à la simplification de vos paiements et de votre gestion financière.
        Notre mission est de rendre les transactions numériques accessibles, sécurisées et transparentes pour tous, particuliers comme professionnels.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Notre histoire</h2>
        <p>
          Fondée en 2024 par une équipe passionnée de technologie et de finance, Dazno.de est née d’un constat simple : les solutions de paiement existantes étaient souvent complexes, coûteuses ou peu adaptées aux besoins réels des utilisateurs.
          Nous avons donc décidé de créer une plateforme moderne, intuitive et fiable, qui place l’utilisateur au centre de ses priorités.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Nos valeurs</h2>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Innovation</strong> : Nous investissons continuellement dans la recherche et le développement pour offrir des fonctionnalités à la pointe de la technologie.</li>
          <li><strong>Sécurité</strong> : La protection de vos données et de vos transactions est notre priorité absolue.</li>
          <li><strong>Transparence</strong> : Pas de frais cachés, pas de mauvaises surprises. Nous croyons en une communication claire et honnête.</li>
          <li><strong>Accessibilité</strong> : Notre interface est pensée pour être simple d’utilisation, quel que soit votre niveau d’expertise.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Notre équipe</h2>
        <p>
          Dazno.de, c’est avant tout une équipe soudée, composée d’experts en développement logiciel, en cybersécurité et en expérience utilisateur.
          Nous sommes à votre écoute pour améliorer sans cesse nos services.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Nous contacter</h2>
        <p>
          Une question ? Une suggestion ? N’hésitez pas à nous écrire à{" "}
          <a href="mailto:contact@dazno.de" className="text-blue-600 underline">contact@dazno.de</a>
          {" "}ou via notre formulaire de contact.
        </p>
      </section>
    </main>
  );
}
