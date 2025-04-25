import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaQuestionCircle, FaUserCircle, FaEnvelope } from "react-icons/fa";

interface FAQItem {
  question: string;
  answer: string;
}

interface TestimonialItem {
  text: string;
  name: string;
  role: string;
}

const AboutPage: React.FC = () => {
  const { t } = useTranslation("about");

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* FAQ Section */}
      <motion.section className="mb-16" {...fadeInUp}>
        <div className="text-center mb-12">
          <FaQuestionCircle className="mx-auto h-12 w-12 text-blue-500" />
          <h2 className="mt-4 text-3xl font-bold text-gray-900">
            {t("faq.title")}
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {(t("faq.items", { returnObjects: true }) as FAQItem[]).map(
            (item, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.question}
                </h3>
                <p className="text-gray-600">{item.answer}</p>
              </motion.div>
            )
          )}
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section className="mb-16" {...fadeInUp}>
        <div className="text-center mb-12">
          <FaUserCircle className="mx-auto h-12 w-12 text-blue-500" />
          <h2 className="mt-4 text-3xl font-bold text-gray-900">
            {t("testimonials.title")}
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {(
            t("testimonials.items", {
              returnObjects: true,
            }) as TestimonialItem[]
          ).map((item, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md text-center"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-gray-600 mb-4">"{item.text}"</p>
              <h4 className="font-semibold text-gray-900">{item.name}</h4>
              <p className="text-sm text-gray-500">{item.role}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Newsletter Section */}
      <motion.section className="bg-blue-50 rounded-xl p-8" {...fadeInUp}>
        <div className="text-center mb-8">
          <FaEnvelope className="mx-auto h-12 w-12 text-blue-500" />
          <h2 className="mt-4 text-3xl font-bold text-gray-900">
            {t("newsletter.title")}
          </h2>
          <p className="mt-2 text-gray-600">{t("newsletter.description")}</p>
        </div>
        <div className="max-w-md mx-auto">
          <form className="flex gap-4">
            <input
              type="email"
              placeholder={t("newsletter.placeholder")}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {t("newsletter.button")}
            </button>
          </form>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutPage;
