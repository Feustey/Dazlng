"use client";
import ContactForm from 'components/shared/ui/ContactForm';

export default function ContactScreen(): React.ReactElement {
  return (
    <div className="flex flex-col h-full bg-background">
      <h1 className="text-2xl font-bold mb-10 text-secondary">Contactez-nous</h1>
      <p className="text-base text-gray-600 mb-30">
        Une question ? Un projet ? N'hésitez pas à nous contacter, nous vous répondrons dans les plus brefs délais.
      </p>
      <ContactForm />
    </div>
  );
} 