import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  optional?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({ label, error, optional, ...props }) => {
  return (
    <div className="mb-4">
      <label className="block text-base font-semibold mb-1">
        {label}
        {optional && <span className="ml-2 text-sm text-gray-400 italic">(optionnel)</span>}
      </label>
      <input
        className={`w-full bg-gray-100 border-2 border-gray-300 rounded-lg px-4 py-2 text-base focus:outline-none focus:border-blue-500 ${error ? 'border-red-500' : ''}`}
        {...props}
      />
      {error && <div className="text-red-500 text-sm mt-1 font-medium">{error}</div>}
    </div>
  );
};

export default FormInput; 