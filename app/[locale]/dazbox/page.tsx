import { useTranslations } from "next-intl";
import PageContainer from "@/components/layout/PageContainer";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Button from "@/components/ui/button";
import { Shield, Rocket, ArrowRight, Package, Zap, Clock } from "lucide-react";
import Link from "next/link";

export default function DazboxPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = useTranslations("Daznode");

  return (
    <PageContainer title={t("title")} subtitle={t("description")}>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
          <p className="text-xl text-muted-foreground">{t("description")}</p>
        </div>

        {/* Section Commencez Maintenant */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Commencez Maintenant</h2>
              <p className="text-xl">
                Obtenez votre Dazbox et rejoignez le réseau Lightning
              </p>

              <div className="flex items-center space-x-4">
                <Package className="h-6 w-6" />
                <div>
                  <p className="font-bold">Prix à partir de</p>
                  <p className="text-3xl font-bold">400,000 sats</p>
                  <p className="text-sm text-muted-foreground">
                    Livraison gratuite
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Clock className="h-6 w-6" />
                <div>
                  <p className="font-bold">Livraison en 2-3 jours</p>
                  <p className="text-sm text-muted-foreground">En stock</p>
                </div>
              </div>

              <Link href={`/${locale}/checkout`} className="w-full">
                <Button className="w-full text-lg py-6">
                  Commander Maintenant <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Statistiques du Réseau</h2>
              <p className="text-xl">
                Découvrez la puissance du réseau Lightning
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-4xl font-bold">10,000+</p>
                  <p className="text-muted-foreground">Nœuds Totaux</p>
                </div>
                <div className="space-y-2">
                  <p className="text-4xl font-bold">50,000+</p>
                  <p className="text-muted-foreground">Canaux Actifs</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="relative">
            <div className="absolute -top-3 left-0 right-0 flex justify-center">
              <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm">
                Offre de lancement
              </span>
            </div>
            <CardHeader>
              <CardTitle>Dazbox Basic</CardTitle>
              <CardDescription>Nœud Lightning pré-configuré</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-3xl font-bold">400,000 sats</p>
                <p className="text-sm text-muted-foreground line-through">
                  500,000 sats
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    Nœud Lightning pré-configuré
                  </li>
                  <li className="flex items-center">
                    <Zap className="mr-2 h-4 w-4" />
                    50,000 sats pré-chargés
                  </li>
                  <li className="flex items-center">
                    <Rocket className="mr-2 h-4 w-4" />
                    Interface de gestion
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/${locale}/checkout`} className="w-full">
                <Button className="w-full">
                  Commander <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="relative border-primary">
            <div className="absolute -top-3 left-0 right-0 flex justify-center">
              <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm">
                Populaire
              </span>
            </div>
            <CardHeader>
              <CardTitle>Dazbox Pro</CardTitle>
              <CardDescription>
                Tout ce qui est inclus dans Basic
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-3xl font-bold">499,000 sats</p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    Tout ce qui est inclus dans Basic
                  </li>
                  <li className="flex items-center">
                    <Zap className="mr-2 h-4 w-4" />
                    100,000 sats pré-chargés
                  </li>
                  <li className="flex items-center">
                    <Rocket className="mr-2 h-4 w-4" />
                    Support prioritaire
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/${locale}/checkout`} className="w-full">
                <Button className="w-full">
                  Commander <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dazbox Enterprise</CardTitle>
              <CardDescription>Solution sur mesure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-3xl font-bold">999,000 sats</p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    Tout ce qui est inclus dans Pro
                  </li>
                  <li className="flex items-center">
                    <Zap className="mr-2 h-4 w-4" />
                    500,000 sats pré-chargés
                  </li>
                  <li className="flex items-center">
                    <Rocket className="mr-2 h-4 w-4" />
                    Support 24/7
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/${locale}/checkout`} className="w-full">
                <Button className="w-full">
                  Commander <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
