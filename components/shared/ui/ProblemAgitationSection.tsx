import React from "react";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

const ProblemAgitationSection = () => {
  const { t } = useAdvancedTranslation("common");
  
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          {t("common.problem_section")}
        </h2>
        <p className="text-lg text-gray-600 text-center">
          Section en cours de développement
        </p>
      </div>
    </div>
  );
};

export default ProblemAgitationSection;
