'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useConversionTracking } from '../../../hooks/useConversionTracking';

export interface Feature {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  benefit: string;
  stats?: string;
}

const DazBoxFeatures: React.FC = () => {) => observer.disconnect();
  }, [trackProductInterest]);

  const handleFeatureClick = (featureId: string): void => {
    trackProductInterest('dazbox', 'feature_interaction', { 
      feature: featureId,
      action: 'click'
    });
  };

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Pourquoi Choisir{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              DazBox ?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            DazBox révolutionne l'accès au Lightning Network avec une solution 
            simple, sécurisée et rentable pour tous.
          </p>
        </div>

        {/* Features Grid */}
        <div ref={featuresRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature: any, index: any) => (
            <div
              key={feature.id}
              data-feature-id={feature.id}
              onClick={() => handleFeatureClick(feature.id)}
              className={`
                group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl 
                transform transition-all duration-700 cursor-pointer
                hover:scale-105 border border-gray-100
                ${visibleFeatures.has(feature.id) 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-8 opacity-0'
                }
              `}
              style={{
                transitionDelay: `${index * 100}ms`
              }}
            >
              {/* Icon */}
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Benefit Badge */}
                <div className="inline-flex items-center bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {feature.benefit}
                </div>

                {/* Stats */}
                {feature.stats && (
                  <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <p className="text-sm text-gray-700 font-medium">
                      📊 {feature.stats}
                    </p>
                  </div>
                )}
              </div>

              {/* Hover indicator */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          ))}
        </div>

  
      </div>
    </section>
};
};

export default DazBoxFeatures; 