import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Features from "@/components/Features";
import { AnimatedHero, AnimatedStat } from "@/components/HomeAnimations";

export default async function HomePage() {
  const t = await getTranslations("pages.home");

  const stats = [
    {
      title: t("stats.nodes"),
      value: "10,000+",
      description: t("stats.nodesDescription"),
    },
    {
      title: t("stats.channels"),
      value: "50,000+",
      description: t("stats.channelsDescription"),
    },
    {
      title: t("stats.capacity"),
      value: "1,000 BTC",
      description: t("stats.capacityDescription"),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-background to-background/50">
        <AnimatedHero>
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                {t("title")}
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                {t("description")}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/daznode"
                  className="btn-gradient py-2 px-6 rounded-lg text-white font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {t("cta.start")}
                </Link>
                <Link
                  href="/learn"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("cta.learn")}
                </Link>
              </div>
            </div>
          </div>
        </AnimatedHero>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <AnimatedStat key={index} index={index}>
                <h3 className="text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </h3>
                <h4 className="text-xl font-semibold mb-2">{stat.title}</h4>
                <p className="text-muted-foreground">{stat.description}</p>
              </AnimatedStat>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Features />
    </div>
  );
}
