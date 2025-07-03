"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  expertise: string[];
  linkedin?: string;
  github?: string;
  twitter?: string;
  avatar: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Thomas Laurent",
    role: "Fondateur & CEO",
    bio: "Expert Bitcoin depuis 2017, ancien développeur chez Ledger. Spécialisé dans l'infrastructure Lightning Network et la sécurité des nœuds.",
    expertise: ["Bitcoin", "Lightning Network", "Infrastructure", "Sécurité"],
    linkedin: "https://linkedin.com/in/thomas-laurent-daznode",
    github: "https://github.com/thomaslaurent",
    twitter: "https://twitter.com/thomaslaurent",
    avatar: "/assets/images/team/thomas-laurent.jpg"
  },
  {
    name: "Marie Dubois",
    role: "CTO & Lead Developer",
    bio: "Ingénieure logiciel avec 8 ans d'expérience. Spécialisée dans les systèmes distribués et l'optimisation de performance des nœuds Lightning.",
    expertise: ["Architecture", "Performance", "DevOps", "Monitoring"],
    linkedin: "https://linkedin.com/in/marie-dubois-daznode",
    github: "https://github.com/mariedubois",
    avatar: "/assets/images/team/marie-dubois.jpg"
  },
  {
    name: "Alexandre Moreau",
    role: "Lead Data Scientist",
    bio: "Docteur en IA appliquée aux systèmes financiers. Développe les algorithmes de prédiction et d'optimisation des nœuds Lightning.",
    expertise: ["Machine Learning", "Data Science", "Optimisation", "Analytics"],
    linkedin: "https://linkedin.com/in/alexandre-moreau-daznode",
    github: "https://github.com/alexmoreau",
    avatar: "/assets/images/team/alexandre-moreau.jpg"
  }
];

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            L'équipe derrière DazNode
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Des experts Bitcoin et Lightning Network passionnés par la démocratisation 
            des technologies financières décentralisées.
          </p>
        </div>

        {/* Équipe */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="text-center mb-4">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/assets/images/avatar-placeholder.jpg";
                    }}
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-blue-600 font-medium">{member.role}</p>
              </div>
              
              <p className="text-gray-700 text-sm mb-4">{member.bio}</p>
              
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Expertise :</h4>
                <div className="flex flex-wrap gap-2">
                  {member.expertise.map((skill, skillIndex) => (
                    <span 
                      key={skillIndex}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center space-x-3">
                {member.linkedin && (
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                )}
                {member.github && (
                  <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                )}
                {member.twitter && (
                  <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Valeurs et Mission */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Notre Mission</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌐</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Démocratisation</h3>
              <p className="text-gray-600">
                Rendre les technologies Bitcoin et Lightning accessibles à tous, 
                sans prérequis techniques complexes.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sécurité</h3>
              <p className="text-gray-600">
                Priorité absolue à la sécurité des fonds et des données de nos utilisateurs, 
                avec des audits réguliers.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600">
                Développement continu de nouvelles fonctionnalités basées sur 
                les retours de notre communauté.
              </p>
            </div>
          </div>
        </div>

        {/* Statistiques Vérifiables */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Nos Chiffres</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">847</div>
              <div className="text-sm text-gray-600">Nœuds actifs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
              <div className="text-sm text-gray-600">Uptime moyen</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">15.7 BTC</div>
              <div className="text-sm text-gray-600">Capacité totale</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">4.8/5</div>
              <div className="text-sm text-gray-600">Note utilisateurs</div>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              * Données vérifiables sur les explorateurs Lightning publics
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-blue-50 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-blue-900 mb-4">Envie de nous rejoindre ?</h3>
          <p className="text-blue-800 mb-6">
            Nous recrutons des talents passionnés par Bitcoin et Lightning Network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Nous contacter
            </Link>
            <Link 
              href="/careers" 
              className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Voir nos offres
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
