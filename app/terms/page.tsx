"use client";

import { useTranslations } from "next-intl";
import PageContainer from "@/components/layout/PageContainer";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function TermsPage() {
  const t = useTranslations("Terms");

  const termsSections = [
    {
      icon: <FileText className="w-6 h-6 text-primary" />,
      title: "Acceptation des Conditions",
      description:
        "En accédant et en utilisant les services DazLng, vous acceptez d'être lié par ces Conditions d'Utilisation. Si vous n'êtes pas d'accord, veuillez ne pas utiliser nos services.",
    },
    {
      icon: <Shield className="w-6 h-6 text-secondary" />,
      title: "Responsabilités de l'Utilisateur",
      description:
        "Vous êtes responsable de la sécurité de votre compte, de vos clés privées et de toutes les activités qui se produisent sous votre compte.",
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-accent" />,
      title: "Limitations du Service",
      description:
        "Nos services sont fournis 'tels quels' sans garanties. Nous ne sommes pas responsables des pertes encourues lors de l'utilisation de notre plateforme.",
    },
  ];

  const allowedActivities = [
    {
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      text: "Utiliser la plateforme pour des transactions légitimes sur le Lightning Network",
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      text: "Gérer votre propre nœud et vos canaux",
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      text: "Participer à la communauté et fournir des retours d'expérience",
    },
  ];

  const prohibitedActivities = [
    {
      icon: <XCircle className="w-5 h-5 text-red-500" />,
      text: "S'engager dans des activités illégales ou le blanchiment d'argent",
    },
    {
      icon: <XCircle className="w-5 h-5 text-red-500" />,
      text: "Tenter de compromettre la sécurité du réseau",
    },
    {
      icon: <XCircle className="w-5 h-5 text-red-500" />,
      text: "Utiliser le service pour du spam ou des activités malveillantes",
    },
  ];

  return (
    <PageContainer
      title="Conditions d'Utilisation"
      subtitle="Veuillez lire attentivement ces conditions avant d'utiliser nos services"
    >
      {/* Section Vue d'ensemble des Conditions */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gradient">
            Vue d'ensemble des Conditions
          </CardTitle>
          <CardDescription className="text-gray-300">
            Comprendre vos droits et responsabilités
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {termsSections.map((section, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border border-gray-800 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    {section.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gradient">
                      {section.title}
                    </h3>
                    <p className="text-gray-300 mt-1">{section.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section Activités Autorisées et Interdites */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gradient">
            Règles d'Utilisation de la Plateforme
          </CardTitle>
          <CardDescription className="text-gray-300">
            Ce que vous pouvez et ne pouvez pas faire sur notre plateforme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gradient">
                Activités Autorisées
              </h3>
              <ul className="space-y-3 text-gray-300">
                {allowedActivities.map((activity, index) => (
                  <li key={index} className="flex items-start gap-2">
                    {activity.icon}
                    <span>{activity.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gradient">
                Activités Interdites
              </h3>
              <ul className="space-y-3 text-gray-300">
                {prohibitedActivities.map((activity, index) => (
                  <li key={index} className="flex items-start gap-2">
                    {activity.icon}
                    <span>{activity.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Modifications du Service */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gradient">
            Modifications du Service
          </CardTitle>
          <CardDescription className="text-gray-300">
            Comment nous gérons les changements de nos services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-gray-300">
            <p>
              Nous nous réservons le droit de modifier ou d'interrompre toute
              partie de nos services à tout moment. Nous informerons des
              changements importants via notre plateforme ou par email.
            </p>
            <p>
              Votre utilisation continue de nos services après toute
              modification indique votre acceptation des conditions mises à
              jour.
            </p>
            <p className="text-sm text-gray-400 mt-4">
              Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
            </p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
