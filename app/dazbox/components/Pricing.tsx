'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useConversionTracking } from '../../../hooks/useConversionTracking';

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number; // Prix en satoshis
  originalPrice?: number; // Prix original en satoshis
  discount?: string;
  features: string[];
  recommended?: boolean;
  badge?: string;
  ctaText: string;
  ctaVariant: 'primary' | 'secondary';
}

const DazBoxPricing: React.FC = () => {
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choisissez Votre{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              DazBox
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Toutes nos DazBox sont livrées avec une garantie de satisfaction de 30 jours 
            et commencent à générer des revenus dès le premier jour.
          </p>
          
          {/* ROI Calculator CTA */}
          <button 
            onClick={handleCalculateROI}
            className="inline-flex items-center bg-green-100 text-green-800 px-6 py-3 rounded-full font-semibold hover:bg-green-200 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 002 2z" />
            </svg>
            Calculer Mon Retour sur Investissement
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan: any) => (
            <div
              key={plan.id}
              className={`
                relative bg-white rounded-3xl border-2 p-8 transform transition-all duration-300
                hover:scale-105 hover:shadow-2xl
                ${plan.recommended 
                  ? 'border-blue-500 shadow-2xl scale-105' 
                  : 'border-gray-200 shadow-lg hover:border-blue-300'
                }
              `}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                    {plan.badge}
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-6">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-4xl font-bold text-orange-500">
                      {formatSatsPrice(plan.price)}
                    </span>
                    {plan.originalPrice && (
                      <div className="text-right">
                        <div className="text-lg text-gray-400 line-through">
                          {formatSatsPrice(plan.originalPrice)}
                        </div>
                        <div className="text-sm font-bold text-red-500">
                          {plan.discount}
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm mt-2">
                    Paiement unique • Livraison gratuite
                  </p>
                </div>

                {/* ROI Estimate */}
                <div className="bg-green-50 rounded-lg p-3 mb-6">
                  <p className="text-green-800 font-semibold text-sm">
                    💰 Retour sur investissement estimé: 3-6 mois
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature: any, featureIndex: any) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-sm leading-relaxed">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handlePlanSelect(plan)}
                className={`
                  w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300
                  ${plan.ctaVariant === 'primary'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
                    : 'border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50'
                  }
                `}
              >
                {plan.ctaText}
              </button>

              {/* Additional Info */}
              <div className="text-center mt-4">
                <p className="text-xs text-gray-500">
                  ✅ Garantie 30 jours • 🚀 Installation incluse • 📞 Support gratuit
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Vous hésitez encore ?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Nos experts sont disponibles pour vous conseiller et vous aider à choisir 
              la DazBox qui correspond le mieux à vos objectifs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors">
                Parler à un Expert
              </button>
              <button className="border-2 border-blue-600 text-blue-600 font-bold px-8 py-3 rounded-xl hover:bg-blue-600 hover:text-white transition-colors">
                Voir une Démo Live
              </button>
            </div>
          </div>

          {/* Trust Signals */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">500+</div>
              <div className="text-sm text-gray-600">DazBox Déployées</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">99.9%</div>
              <div className="text-sm text-gray-600">Uptime Garanti</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">24/7</div>
              <div className="text-sm text-gray-600">Support Expert</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">5min</div>
              <div className="text-sm text-gray-600">Installation</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DazBoxPricing; 