import React from "react";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  optional?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({ label, error, optional, ...props }) => {
  const { t } = useAdvancedTranslation();
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {optional && <span className="ml-2 text-sm text-gray-400 italic">{t("FormInput.optionnel")}</span>}
      </label>
      <input
        {...props}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          error ? 'border-red-500' : ''
        }`}
      />
      {error && <div className="text-red-500 text-sm mt-1 font-medium">{error}</div>}
    </div>
  );
};

export default FormInput;