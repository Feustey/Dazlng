"use client";
import React from "react";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

const SecurityAuditPage: React.FC = () => {
  const { t } = useAdvancedTranslation("docs");
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {t("common.audit_de_securite_2024")}
          </h1>
          <div className="prose max-w-none">
            <p className="text-gray-600">
              {t("common.rapport_daudit_de_securite_en_co")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityAuditPage; 