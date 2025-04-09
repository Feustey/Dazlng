import { Metadata } from "next";
import ContactForm from "../../components/ContactForm";
import { Card } from "../../components/ui/card";
import { useTranslations } from "next-intl";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Contactez-nous | Daznode",
  description:
    "Prenez contact avec l'équipe Daznode pour toute question, support ou opportunité de collaboration.",
};

export default function ContactPage() {
  const t = useTranslations("Contact");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-12">
          <div className="text-center md:text-left">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t("title")}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t("description")}
            </p>
          </div>

          <div className="flex justify-center md:justify-start">
            <Image
              src="/shop.png"
              alt="Boutique Daznode"
              width={240}
              height={240}
              className="drop-shadow-xl"
            />
          </div>
        </div>

        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 shadow-xl p-6">
          <ContactForm />
        </Card>
      </div>
    </div>
  );
}
