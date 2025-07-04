"use client";

import React from "react";
import { OptimizedHero } from "@/components/optimized/OptimizedHero";
import { LightningPricingSection } from "@/components/lightning/SatsPricingCard";
import { LightningROICalculator } from "@/components/lightning/LightningROICalculator";
import { SocialProofSection } from "@/components/lightning/LiveMetrics";
import { LiveChannelMonitor } from "@/components/lightning/LiveChannelMonitor";
import { ProofOfPerformance, LightningAnalyticsDashboard } from "@/components/lightning/ProofOfPerformance";
import { MobileOptimizedPricing, MobileHero } from "@/components/mobile/MobileOptimized";

export const dynamic = "force-dynamic";

export default function OptimizedDemoPage() {
  return (
    <div>
      
      {/* Desktop Hero  */}
      <div>
        <OptimizedHero />
      </div>

      {/* Mobile Hero  */}
      <MobileHero />

      {/* Social Proof Section  */}
      <SocialProofSection />

      {/* Live Channel Monitor Demo  */}
      <section>
        <div>
          <div>
            <h2>
              Monitoring IA en Action
            </h2>
            <p>
              Démonstration live de notre système de monitoring intelligent des canaux Lightning.
              Données mises à jour en temps réel.
            </p>
          </div>
          
          <LiveChannelMonitor />
        </div>
      </section>

      {/* ROI Calculator  */}
      <section>
        <div>
          <LightningROICalculator 
            onCalculationComplete={(calculation) => {
              // Track calculator usage
              if (typeof window !== "undefined" && window.gtag) {
                window.gtag("event", "roi_calculator_used", {
                  event_category: "engagement",
                  roi_percentage: calculation.roi.toFixed(0),
                  break_even_months: calculation.breakEvenMonths
                });
              }
            }}
          />
        </div>
      </section>

      {/* Pricing Section  */}
      <LightningPricingSection />

      {/* Mobile Pricing  */}
      <MobileOptimizedPricing />

      {/* Proof of Performance  */}
      <ProofOfPerformance />

      {/* Lightning Analytics  */}
      <LightningAnalyticsDashboard />

      {/* CTA Section  */}
      <section>
        <div>
          <div>
            <h2>
              Prêt à Optimiser Vos Revenus Lightning ?
            </h2>
            <p>
              Rejoignez les 500+ node runners qui utilisent l'IA DazNode pour 
              maximiser leurs revenus et éviter les force-closes coûteux.
            </p>
          </div>

          {/* Final CTAs  */}
          <div>
            <button 
              onClick={() => window.location.href = "/register?plan=pro&trial=7days"}
              className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:from-yellow-300 hover:to-orange-300 hover:shadow-xl hover:shadow-yellow-400/30 hover:transform hover:scale-105"
            >
              ⚡ Commencer l'Essai Gratuit
            </button>

            <button 
              onClick={() => window.open("https://demo.dazno.de", "_blank")}
              className="border-2 border-gray-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:border-yellow-400 hover:bg-yellow-400/10 transition-all duration-300"
            >
              Voir la Démo Live
            </button>
          </div>

          {/* Trust Signals  */}
          <div>
            <div>
              <span className="text-green-400 mr-2">✓</span>
              <span>7 jours gratuits</span>
            </div>
            <div>
              <span className="text-green-400 mr-2">✓</span>
              <span>Aucune carte bancaire</span>
            </div>
            <div>
              <span className="text-green-400 mr-2">✓</span>
              <span>Configuration en 5 minutes</span>
            </div>
          </div>

          {/* Social Proof  */}
          <div>
            <div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">500+</div>
                <div className="text-xs text-gray-400">Node Runners</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">₿47.3</div>
                <div className="text-xs text-gray-400">Sous gestion</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">99.7%</div>
                <div className="text-xs text-gray-400">Uptime</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">87%</div>
                <div className="text-xs text-gray-400">Précision IA</div>
              </div>
            </div>
            
            <p>
              "DazNode m'a fait économiser 0.2 BTC en frais de force-close cette année" 
              - Node Runner anonyme
            </p>
          </div>
        </div>
      </section>

      {/* Footer with additional links  */}
      <footer>
        <div>
          <div>
            <div>
              <span className="text-white font-bold text-xl">DazNode</span>
              <div>
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span>Système opérationnel</span>
              </div>
            </div>

            <div>
              <a href="/privacy">
                Confidentialité
              </a>
              <a href="/terms">
                Conditions
              </a>
              <a href="/contact">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}