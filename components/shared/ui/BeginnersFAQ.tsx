import React, { useState } from 'react';

const BeginnersFAQ: React.FC = () => {
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Questions fréquentes des débutants
          </h2>
          <p className="text-xl text-gray-600">
            Toutes les réponses aux questions que vous vous posez avant de commencer votre aventure Lightning
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq: any, index: any) => (
            <div 
              key={index}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium mr-4">
                    {faq.category}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                </div>
                <svg 
                  className={`w-6 h-6 text-gray-500 transform transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openIndex === index && (
                <div className="px-8 pb-6">
                  <div className="border-t pt-4">
                    <p className="text-gray-700 leading-relaxed text-lg">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact support */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Une autre question ?</h3>
            <p className="text-lg mb-6 text-indigo-100">
              Notre communauté est là pour vous aider ! Rejoignez notre Discord pour poser vos questions directement aux experts.
            </p>
            <button className="bg-white text-indigo-600 font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors">
              Poser ma question sur Discord
            </button>
          </div>
        </div>
      </div>
    </section>
  );

export default BeginnersFAQ; 