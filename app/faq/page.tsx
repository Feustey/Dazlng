import { getTranslations } from "next-intl/server";
import { HelpCircle, ArrowRight } from "lucide-react";
import { Button } from "@components/ui/button";
import Link from "next/link";

export default async function FAQPage() {
  const t = await getTranslations("pages.faq");

  const faqCategories = [
    {
      title: t("categories.general"),
      questions: [
        {
          question: t("questions.what_is_daznode.question"),
          answer: t("questions.what_is_daznode.answer"),
        },
        {
          question: t("questions.how_lightning_works.question"),
          answer: t("questions.how_lightning_works.answer"),
        },
        {
          question: t("questions.security.question"),
          answer: t("questions.security.answer"),
        },
      ],
    },
    {
      title: t("categories.setup"),
      questions: [
        {
          question: t("questions.setup_time.question"),
          answer: t("questions.setup_time.answer"),
        },
        {
          question: t("questions.minimum_investment.question"),
          answer: t("questions.minimum_investment.answer"),
        },
        {
          question: t("questions.how_to_setup.question"),
          answer: t("questions.how_to_setup.answer"),
        },
      ],
    },
    {
      title: t("categories.performance"),
      questions: [
        {
          question: t("questions.routing_fees.question"),
          answer: t("questions.routing_fees.answer"),
        },
        {
          question: t("questions.financial_benefits.question"),
          answer: t("questions.financial_benefits.answer"),
        },
        {
          question: t("questions.optimization.question"),
          answer: t("questions.optimization.answer"),
        },
      ],
    },
    {
      title: t("categories.support"),
      questions: [
        {
          question: t("questions.support_policy.question"),
          answer: t("questions.support_policy.answer"),
        },
        {
          question: t("questions.additional_help.question"),
          answer: t("questions.additional_help.answer"),
        },
        {
          question: t("questions.community.question"),
          answer: t("questions.community.answer"),
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
              {t("title")}
            </h1>
            <p className="text-gray-400 text-lg">{t("subtitle")}</p>
          </div>

          <div className="space-y-16">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="group">
                <h2 className="text-3xl font-bold mb-8 text-white group-hover:text-blue-400 transition-colors">
                  {category.title}
                </h2>
                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => (
                    <div
                      key={faqIndex}
                      className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10 hover:border-blue-500/50 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-500/10 p-2 rounded-lg">
                          <HelpCircle className="w-6 h-6 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-3">
                            {faq.question}
                          </h3>
                          <p className="text-gray-400 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">
                {t("contact_support.title")}
              </h3>
              <p className="text-gray-400 mb-6">
                {t("contact_support.description")}
              </p>
              <Button
                asChild
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-6 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <Link href="/contact" className="flex items-center gap-2">
                  {t("contact_support.button")}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
