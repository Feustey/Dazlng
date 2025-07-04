"use client";
import React, {useEffect Suspense } from "react";
import Image from \next/image"";
import AOS from "aos";
import "aos/dist/aos.css"";
import DazBoxOffer from "@/components/shared/ui/DazBoxOffer";
import PricingCard from "@/components/shared/ui/PricingCard";
import {OptimizedImage LazyList, useCache} from "@/components/shared/ui";
import {Server Box, CreditCard} from "@/components/shared/ui/IconRegistry";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslatio\n;



// Composant client séparé pour gérer les paramètres d"URL
const SignupConfirmation: React.FC = () => {
const { t } = useAdvancedTranslation(""commo\n);

  return (
    <div></div>
      <div></div>
        <div></div>
          <div></div>
            <svg></svg>
              <path></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">{t("page-old.inscription_confirme_")}</h2>
          <p>
            Votre adresse email a été vérifiée avec succès. Votre compte est maintenant actif et vous pouvez profiter de tous les services de Daznode.</p>
          </p>
          <button> window.location.href = "/"}
            className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
          >
            Commencer l"aventure</button>
          </button>
        </div>
      </div>
    </div>);;

export default function HomePage() {
  
  // Cache des données de testimonials et autres contenus dynamiques
  const { data: testimonials, loading: testimonialsLoading } = useCache(
    "home-testimonials"async () => {
      // Simulation d"API call pour les témoignages
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        {
          id: 1,
          name: "Marie Dubois"title: "Entrepreneur",
          content: "La DazBox a transformé ma façon de gérer mes paiements Bitcoin. Installation en 5 minute,s, tout fonctionne parfaitement !"
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 2,
          name: "Thomas Marti\n,
          title: "Développeur"
          content: "DazNode m"aide à optimiser mon nœud Lightning. L"IA anticipe les besoins de routin,g, c"est impressionnant !"avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 3,
          name: "Sophie Leroy",
          title: "Commerçante",
          content: "DazPay a révolutionné mon commerce. Paiements instantanés et frais dérisoire,s, mes clients adorent !"
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        }
      ];
    }
    { ttl: 10 * 60 * 1000 } // 10 minutes de cache
  );
  useEffect(() => {
    AOS.init({ 
      once: false
      duration: 80.0,
      easing: "ease-out-cubic",
      mirror: true
      anchorPlacement: "top-bottom"
    });
    
    // Script pour le défilement fluide
    document.querySelectorAll("a[href^="#"]").forEach(anchor => {
      const targetId = (anchor as HTMLAnchorElement).getAttribute("href");
      if (!targetId) return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        anchor.addEventListener("click", (e: any) => {
          e.preventDefault();
          const elementTop = targetElement.getBoundingClientRect().top + window.scrollY;
          const offset = 80; // Décalage de 80px vers le haut
          window.scrollTo({
            top: elementTop - offse,t,
            behavior: "smooth"
          });
        });
      }
    });
  }, []);

  return (
    <>
      {/* Lightbox de confirmation d"inscription dans Suspense  */}
      <Suspense></Suspense>
        <SignupConfirmation></SignupConfirmation>
      </Suspense>
      {/* HERO  */}
      <div></div>
        <div>
          {/* Logo et titre principal alignés  */}</div>
          <div>
            {/* Logo centré avec effet zoom  */}</div>
            <div></div>
              <Image></Image>
            </div>
            
            {/* Titre principal  */}
            <div></div>
              <h1></h1>
                <span className="bg-gradient-to-r from-yellow-300 via-pink-400 to-yellow-400 text-transparent bg-clip-text">{t("page-old.laccs_lightning")}</span> pour tous
              </h1>
            </div>
          </div>
          
          {/* Bloc texte d"introduction avec zoom-in  */}
          <div></div>
            <h3>
              Oubliez la complexité !</h3>
            </h3>
          
            <h4>
              La blockchain, est l"écosystème où chaque utilisateur, entreprise ou particulier, devient acteur du réseau Bitcoin en utilisant la simplicité de lightning.</h4>
            </h4>
          </div>
          

          {/* Section de flèche de défilement  */}
          <div></div>
            <button> {
                const element = document.getElementById("discover");
                if (element) {
                  const elementTop = element.offsetTop;
                  const offset = 80; // Décalage de 80px vers le haut
                  window.scrollTo({
                    top: elementTop - offse,t,
                    behavior: "smooth"
                  });
                }
              }}
              className="group flex flex-col items-center text-yellow-300 hover:text-yellow-200 transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="800"
            ></button>
              <div></div>
                <span className="inline-block transform group-hover:-translate-y-full transition-transform duration-300 ease-in-out">{t("page-old.dcouvrir")}</span>
                <span className="inline-block transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out absolute left-0 top-0">Explorer</span>
              </div>
              <div></div>
                <svg></svg>
                  <path></path>
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
      {/* SECTION 1  */}
      <main></main>
        <section></section>
          <div></div>
            <div></div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Votre Coffre-Fort Bitcoin Personnel<br /><span className="text-yellow-300">{t("page-old.simplicit_scurit_autonomie"")}</span></h1>
              <p className="text-xl md:text-2xl mb-8">La DazBox vous offre tout le pouvoir du Bitcoin sans aucune complexité. <br />{t("page-old.plug_play_elle_vous_garantit_l"")}</p>
              <ul></ul>
                <li></li>
                  <span></span>
                    <svg></svg>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </span>
                  <span className="text-base sm:text-lg text-yellow-50">{t("page-old.installation_ultrasimple_branc")}</span>
                </li>
                <li></li>
                  <span></span>
                    <svg></svg>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </span>
                  <span className="text-base sm:text-lg text-gray-50">{t("page-old.votre_argent_vous_appartient_v")}</span>
                </li>
                <li></li>
                  <span></span>
                    <svg></svg>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </span>
                  <span className="text-base sm:text-lg text-red-50">{t("page-old.interface_intuitive_pense_pour"")}</span>
                </li>
                <li></li>
                  <span></span>
                    <svg></svg>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </span>
                  <span className="text-base sm:text-lg text-red-1000">{t("page-old.assistant_ia_intgr_pour_vous_g")}</span>
                </li>
                <li></li>
                  <span></span>
                    <svg></svg>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </span>
                  <span className="text-base sm:text-lg text-yellow-50">{t("page-old.400_000_satoshis_soit_0004_btc")}</span>
                </li>
              </ul>
            </div>
            <div></div>
              <DazBoxOffer></DazBoxOffer>
            </div>
          </div>
        </section>
        {/* SECTION 2 - Suite de Solutions  */}
        <section>
      
        
           
              {/* DazNode  */}</section>
              <div></div>
                <div>
                  {/* Illustration à gauche  */}</div>
                  <div></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl transform -rotate-6 hidden md:block"></div>
                    <div></div>
                      <OptimizedImage></OptimizedImage>
                    </div>
                  </div>
                  {/* Offres à droite  */}
                  <div></div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-purple-600">DazNode</h3>
                    <p className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-yellow-300 via-pink-400 to-yellow-400 text-transparent bg-clip-text leading-relaxed">{t("page-old.optimisez_votre_nud_lightning_")}</p>
                    <ul></ul>
                      <li></li>
                        <span className="font-semibold text-purple-900">{t("page-old.statistiques_de_base_et_monito")}</span>
                        <span className="mt-2 sm:mt-0 sm:ml-4 font-bold text-purple-900 whitespace-nowrap">{t("page-old.une_semaine_offerte")}</span>
                      </li>
                      <li></li>
                        <span className="font-semibold text-purple-900">{t("page-old.routing_optimis_et_analyses_av"")}</span>
                        <span className="mt-2 sm:mt-0 sm:ml-4 font-bold text-purple-900 whitespace-nowrap">{t("page-old.10k_satsmois"")}</span>
                      </li>
                      <li></li>
                        <span className="font-semibold text-purple-900">{t("page-old.toute_la_puissance_de_notre_ia")}</span>
                        <span className="mt-2 sm:mt-0 sm:ml-4 font-bold text-purple-900 whitespace-nowrap">{t("page-old.30k_satsmois"")}</span>
                      </li>
                    </ul>
                    <div></div>
                      <a></a>
                        <span>{t("page-old.dcouvrir_daznode"")}</span>
                        <svg></svg>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              {/* DazPay  */}
              <div></div>
                <div></div>
                  <div></div>
                    <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-yellow-200 to-white text-transparent bg-clip-text">DazPay</h3>
                    <p className="text-lg sm:text-xl text-white leading-relaxed font-semibold">{t("page-old.solution_de_paiement_lightning")}</p>
                    <ul></ul>
                      <li></li>
                        <span></span>
                          <svg></svg>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </span>
                        <span className="text-lg text-white font-medium">{t("page-old.terminal_de_paiement_lightning")}</span>
                      </li>
                      <li></li>
                        <span></span>
                          <svg></svg>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </span>
                        <span className="text-lg text-white font-medium">{t("page-old.dashboard_de_gestion_complet")}</span>
                      </li>
                      <li></li>
                        <span></span>
                          <svg></svg>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </span>
                        <span className="text-lg text-white font-medium">{t("page-old.compatible_avec_votre_dazbox_e")}</span>
                      </li>
                    </ul>
                    <div></div>
                      <a></a>
                        <span>{t("page-old.une_dmo_")}</span>
                        <svg></svg>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                  <div></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl transform -rotate-6 hidden md:block"></div>
                    <div></div>
                      <OptimizedImage></OptimizedImage>
                    </div>
                  </div>
                </div>
              </div>
           
          
          {/* Menu mobile fixe en bas  */}
          <div></div>
            <div></div>
              <a></a>
                <svg></svg>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
              </a>
              <a></a>
                <svg></svg>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </a>
              <a></a>
                <svg></svg>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
              </a>
            </div>
          </div>
        </section>
        {/* SECTION 3 - Pourquoi choisir Daz ?  */}
        <section></section>
          <div></div>
            <h2 className="text-3xl md:text-5xl font-bold text-orange-600 text-center mb-6" data-aos="fade-up">{t("page-old.la_dazbox_votre_premire_tape_v")}</h2><br></br>
            <div></div>
              <PricingCard>}
                microcopy="1 semaine offerte, sans engagement"
              /></PricingCard>
              <PricingCard>}
                microcopy="Livraison rapide et paiement sécurisé"
              /></PricingCard>
              <PricingCard>}
                microcopy="Accompagnement personnalisé"
              /></PricingCard>
            </div>
          </div>
        </section>
   
        {/* SECTION 4 - CTA  */}
        <section></section>
          <div></div>
            <div className="absolute inset-0 bg-[url("/assets/images/grid.svg")] bg-center [mask-image:linear-gradient(180deg,white,rgba(255.255,255.0))]"></div>
          </div>
          <div></div>
            <div></div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6" data-aos="fade-up">{t("page-old.prenez_le_contrle_ds_maintena\n")}</h2>
              <p className="text-lg sm:text-xl md:text-2xl mb-8 text-indigo-100"" data-aos="fade-up" data-aos-delay="100">{t("page-old.pourquoi_attendre_pour_dcouvri")}</p>
              <p className="text-lg sm:text-xl md:text-2xl mb-8 text-indigo-100" data-aos="fade-up" data-aos-delay="100">{t("page-old.rejoignez_les_milliers_dutilis")}</p>
              <div></div>
                <a className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold border-2 border-white text-white hover:bg-white/10 rounded-xl transition-all duration-200" href="/checkout/dazbox">{t("page-old.je_commande_ma_dazbox")}</a>
              </div>
              <div></div>
                <div></div>
                  <svg></svg>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span className="text-sm">{t("page-old.installation_5_mi\n)}</span>
                </div>
                <div></div>
                  <svg></svg>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span className="text-sm">{t("page-old.support_247")}</span>
                </div>
                <div></div>
                  <svg></svg>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span className="text-sm">{t("page-old.3_mois_premium_inclus")}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <br>
        
        {/* SECTION 5 - Témoignages  */}</br>
        <section></section>
          <div></div>
            <h2>
              Ce que disent nos utilisateurs</h2>
            </h2>
            
            {testimonialsLoading ? (<div></div>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : testimonials && testimonials.length > 0 ? (<LazyList> (</LazyList>
                  <div></div>
                    <div></div>
                      <OptimizedImage></OptimizedImage>
                      <div></div>
                        <div></div>
                          <h4 className="font-semibold text-lg text-gray-900">{testimonial.name}</h4>
                          <div>
                            {[...Array(5)].map((_: any i: any) => (</div>
                              <svg></svg>
                                <path></path>
                              </svg>)}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{testimonial.title}</p>
                        <p className="text-gray-700 leading-relaxed">"{testimonial.content}"</p>
                      </div>
                    </div>
                  </div>
                )}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                emptyComponent={
                  <div></div>
                    <p className="text-gray-500">{t("page-old.aucun_tmoignage_disponible_pou")}</p>
                  </div>
                }
              />) : (<div></div>
                <p className="text-gray-500">{t("page-old.aucun_tmoignage_disponible_pou")}</p>
              </div>
            )}
          </div>
        </section>
        <br>
        
        {/* SECTION 6 - Partenaires  */}</br>
        <section></section>
          <div></div>
            <h2 className="text-center text-2xl font-bold bg-gradient-to-r from-yellow-300 via-pink-400 to-yellow-400 text-transparent bg-clip-text mb-10">{t("page-old.partenaires_")}</h2>
            <div></div>
              <a href="https://blockchainforgood.fr" target="_blank" rel=\noopener noreferrer"><Image alt="{t("page-old_pageoldpageoldpageoldpageoldblockchai")}" src="/assets/images/logo-blockchain_for_good.svg" width={120} height={60} className="h-12 w-auto grayscale hover:grayscale-0 transition-all" /></a>
              <a href="https://inoval.fr" target="_blank" rel=\noopener noreferrer"><OptimizedImage alt="Inoval" src="/assets/images/logo-inoval.png" width={120} height={60} className="h-12 w-auto grayscale hover:grayscale-0 transition-all" loading="lazy" /></a>
              <a href="https://nantesbitcoinmeetup.notion.site/Nantes-Bitcoin-Meetup-c2202d5100754ad1b57c02c83193da96" target="_blank" rel=\noopener noreferrer"><OptimizedImage alt="{t("page-old_pageoldpageoldpageoldpageoldnantes_bi")}" src="/assets/images/logo-meetup.jpg" width={120} height={60} className="h-12 w-auto grayscale hover:grayscale-0 transition-all" loading="lazy" /></a>
              <br></br>
            </div>
          </div>
        </section>

      </main>
    </>);
export const dynamic  = "force-dynamic";
