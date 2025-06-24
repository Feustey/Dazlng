"use client";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from 'next/image';

const HelpPage: React.FC = () => {
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Centre d'aide DazNode</h1>
      
      {/* Catégories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {faqCategories.map((category: any, index: any) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6" data-aos="fade-up" data-aos-delay={index * 100}>
            <div className="mb-4">{category.icon}</div>
            <h2 className="text-xl font-semibold mb-2">{category.title}</h2>
            <p className="text-gray-600">{category.description}</p>
          </div>
        ))}
      </div>

      {/* Questions fréquentes */}
      <div className="space-y-6">
        {faqQuestions.map((faq: any, index: any) => (
          <div key={index} className="bg-white rounded-lg shadow p-6" data-aos="fade-up" data-aos-delay={index * 50}>
            <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
            <p className="text-gray-600">{faq.answer}</p>
            <span className="inline-block mt-2 text-sm font-medium text-primary">{faq.category}</span>
          </div>
        ))}
      </div>
    </div>
  );

export default HelpPage;
