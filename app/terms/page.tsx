import React from 'react';
// import { View, Text, StyleSheet, ScrollView } from 'react-native';
import PageLayout from '../../components/shared/layout/PageLayout';
import PageTitle from '../../components/shared/ui/PageTitle';
import Image from 'next/image';

export default function TermsPage(): React.ReactElement {
  const termsSections = [
    {
      icon: <Image src="/assets/images/icon-file.svg" alt="Fichier" width={32} height={32} className="text-primary" />,
      title: "Acceptation des Conditions",
      description:
        "En accédant et en utilisant les services DazLng, vous acceptez d'être lié par ces Conditions d'Utilisation. Si vous n'êtes pas d'accord, veuillez ne pas utiliser nos services.",
    },
    {
      icon: <Image src="/assets/images/icon-shield.svg" alt="Bouclier" width={32} height={32} className="text-secondary" />,
      title: "Responsabilités de l'Utilisateur",
      description:
        "Vous êtes responsable de la sécurité de votre compte, de vos clés privées et de toutes les activités qui se produisent sous votre compte.",
    },
    {
      icon: <Image src="/assets/images/icon-alert.svg" alt="Alerte" width={32} height={32} className="text-warning" />,
      title: "Limitations du Service",
      description:
        "Nos services sont fournis 'tels quels' sans garanties. Nous ne sommes pas responsables des pertes encourues lors de l'utilisation de notre plateforme.",
    },
  ];

  const allowedActivities = [
    {
      icon: <Image src="/assets/images/icon-check.svg" alt="Valide" width={22} height={22} className="text-green-500" />,
      text: "Utiliser la plateforme pour des transactions légitimes sur le Lightning Network",
    },
    {
      icon: <Image src="/assets/images/icon-check.svg" alt="Valide" width={22} height={22} className="text-green-500" />,
      text: "Gérer votre propre nœud et vos canaux",
    },
    {
      icon: <Image src="/assets/images/icon-check.svg" alt="Valide" width={22} height={22} className="text-green-500" />,
      text: "Participer à la communauté et fournir des retours d'expérience",
    },
  ];

  const prohibitedActivities = [
    {
      icon: <Image src="/assets/images/icon-x.svg" alt="Interdit" width={22} height={22} className="text-red-500" />,
      text: "S'engager dans des activités illégales ou le blanchiment d'argent",
    },
    {
      icon: <Image src="/assets/images/icon-x.svg" alt="Interdit" width={22} height={22} className="text-red-500" />,
      text: "Tenter de compromettre la sécurité du réseau",
    },
    {
      icon: <Image src="/assets/images/icon-x.svg" alt="Interdit" width={22} height={22} className="text-red-500" />,
      text: "Utiliser le service pour du spam ou des activités malveillantes",
    },
  ];

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto p-6">
        <PageTitle>Conditions d'Utilisation</PageTitle>
        <p className="text-base text-muted text-center mb-6 -mt-2">
          Veuillez lire attentivement ces conditions avant d'utiliser nos services
        </p>
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          {termsSections.map((section, idx) => (
            <section
              key={idx}
              className="bg-background rounded-2xl p-6 border-2 border-secondary shadow-md min-w-[260px] max-w-[400px] m-3 flex flex-col items-center"
            >
              <div className="mb-3">{section.icon}</div>
              <h2 className="text-xl font-bold text-secondary mb-2 text-center">{section.title}</h2>
              <p className="text-sm text-muted text-center leading-6">{section.description}</p>
            </section>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <section className="flex-1 min-w-[220px] max-w-[350px] m-3">
            <h3 className="text-lg font-bold text-primary mb-3 text-center">Activités Autorisées</h3>
            {allowedActivities.map((a, idx) => (
              <div key={idx} className="flex items-center mb-2 gap-2">
                {a.icon}
                <span className="text-sm text-muted flex-1">{a.text}</span>
              </div>
            ))}
          </section>
          <section className="flex-1 min-w-[220px] max-w-[350px] m-3">
            <h3 className="text-lg font-bold text-primary mb-3 text-center">Activités Interdites</h3>
            {prohibitedActivities.map((a, idx) => (
              <div key={idx} className="flex items-center mb-2 gap-2">
                {a.icon}
                <span className="text-sm text-muted flex-1">{a.text}</span>
              </div>
            ))}
          </section>
        </div>
        <section className="bg-background rounded-2xl p-6 border-2 border-secondary shadow-md min-w-[260px] max-w-[400px] mx-auto">
          <h2 className="text-xl font-bold text-secondary mb-2 text-center">Modifications du Service</h2>
          <p className="text-sm text-muted text-center leading-6">
            Nous nous réservons le droit de modifier ou d'interrompre toute partie de nos services à tout moment. Nous informerons des changements importants via notre plateforme ou par email.<br />
            Votre utilisation continue de nos services après toute modification indique votre acceptation des conditions mises à jour.
          </p>
          <p className="text-xs text-gray-400 mt-4 text-center">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </section>
      </div>
    </PageLayout>
  );
}
