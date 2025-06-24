import React from 'react';
import Link from 'next/link';

export interface ProfileField {
  name: string;
  label: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  href: string;
}

export interface ProfileCompletionProps {
  profileFields: ProfileField[];
  completionPercentage: number;
  userScore: number;
}

const ProfileCompletion: React.FC<ProfileCompletionProps> = ({
  profileFields,
  completionPercentage,
  userScore
}) => {
  const incompleteFields = profileFields.filter(field => !field.completed);
  const highPriorityFields = incompleteFields.filter(field => field.priority === 'high');

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string): string => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🔵';
      default: return '⚪';
    }
  };

  if (completionPercentage >= 100) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">✅</span>
          <h2 className="text-xl font-semibold text-green-800">Profil complet !</h2>
        </div>
        <p className="text-green-700">
          Votre profil est maintenant complet. Vous bénéficiez de toutes les fonctionnalités personnalisées.
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-green-600">
            Score d'engagement: <span className="font-bold">{userScore}/100</span>
          </div>
          <Link 
            href="/user/settings" 
            className="text-green-600 hover:text-green-700 text-sm font-medium hover:underline"
          >
            Modifier le profil →
          </Link>
        </div>
      </div>
  );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">👋</span>
          <h2 className="text-xl font-semibold text-amber-800">Complétez votre profil</h2>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-amber-800">{completionPercentage}%</div>
          <div className="text-xs text-amber-600">Score: {userScore}/100</div>
        </div>
      </div>
      
      <div className="w-full bg-amber-200 rounded-full h-3 mb-6">
        <div 
          className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full transition-all duration-500" 
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      {highPriorityFields.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-amber-800 mb-3">Actions prioritaires</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {highPriorityFields.slice(0, 2).map((field: any) => (
              <Link 
                key={field.name}
                href={field.href}
                className={`block p-4 rounded-lg border transition-all hover:shadow-md ${getPriorityColor(field.priority)}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getPriorityIcon(field.priority)}</span>
                  <div>
                    <div className="font-medium">{field.label}</div>
                    <div className="text-xs opacity-75">Cliquez pour compléter</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {profileFields.map((field: any) => (
          <div key={field.name} className="flex items-center gap-2">
            <span className={field.completed ? 'text-green-500' : 'text-amber-500'}>
              {field.completed ? '✓' : '●'}
            </span>
            <span className={`text-sm ${field.completed ? 'text-green-700' : 'text-amber-700'}`}>
              {field.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <Link 
          href="/user/settings" 
          className="text-amber-600 hover:text-amber-700 text-sm font-medium hover:underline"
        >
          Compléter mon profil →
        </Link>
      </div>
    </div>
  );

export default ProfileCompletion; 