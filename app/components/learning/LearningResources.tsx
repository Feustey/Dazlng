import * as React from "react";
import { useTranslations } from "next-intl";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import {
  ExternalLink,
  BookOpen,
  Video,
  Code,
  MessageSquare,
} from "lucide-react";

const LearningResources: React.FC = () => {
  const t = useTranslations("Learning");

  const resources = [
    {
      title: "Documentation officielle",
      description: "Guide complet sur le Lightning Network",
      icon: <BookOpen className="h-6 w-6" />,
      link: "https://docs.lightning.network",
      category: "documentation",
    },
    {
      title: "Tutoriels vidéo",
      description: "Vidéos explicatives sur l'utilisation du Lightning Network",
      icon: <Video className="h-6 w-6" />,
      link: "https://www.youtube.com/playlist?list=PLPQwGV1aL3tGJxhcN5fNp8mep2z33F9B7",
      category: "video",
    },
    {
      title: "Code source",
      description: "Repositories GitHub des projets Lightning",
      icon: <Code className="h-6 w-6" />,
      link: "https://github.com/lightningnetwork",
      category: "code",
    },
    {
      title: "Communauté",
      description: "Rejoignez la discussion sur le Lightning Network",
      icon: <MessageSquare className="h-6 w-6" />,
      link: "https://t.me/lightningnetwork",
      category: "community",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="prose dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold mb-4 text-foreground">
          Ressources supplémentaires
        </h2>
        <p className="text-foreground/80">
          Explorez ces ressources pour approfondir votre compréhension du
          Lightning Network.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((resource) => (
          <Card
            key={resource.category}
            className="p-6 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start space-x-4">
              <div className="p-2 rounded-lg bg-primary/10">
                {resource.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2 text-foreground">
                  {resource.title}
                </h3>
                <p className="text-sm text-foreground/80 mb-4">
                  {resource.description}
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    Accéder
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LearningResources;
