import React from 'react';

const T4GSection = () => {
  const rewardCategories = [
    {
      title: "Mentoring",
      description: "Aidez les nouveaux utilisateurs à démarrer avec Lightning",
      points: "100 points"
    },
    {
      title: "Feedback",
      description: "Partagez votre expérience et suggestions d'amélioration",
      points: "50 points"
    },
    {
      title: "Installation Commerçants",
      description: "Aidez un commerçant à accepter le Bitcoin",
      points: "200 points"
    },
    {
      title: "Articles & Contenu",
      description: "Créez du contenu éducatif pour la communauté",
      points: "150 points"
    }
  ];

  const rewards = [
    "Réduction sur l'abonnement Daznode",
    "Merchandising exclusif",
    "Badge de réputation",
    "Frais réduits sur DazPay"
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-2">Token For Good (T4G)</h2>
      <p className="text-base text-gray-500 mb-6">Contribuez à la communauté, gagnez des récompenses</p>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Comment gagner des points</h3>
        {rewardCategories.map((category, index) => (
          <div key={index} className="bg-white rounded-lg p-4 mb-3 shadow-md">
            <div className="text-base font-semibold mb-1">{category.title}</div>
            <div className="text-gray-500 mb-2">{category.description}</div>
            <div className="text-blue-500 font-medium">{category.points}</div>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-4">Utilisez vos points pour</h3>
        {rewards.map((reward, index) => (
          <div key={index} className="text-base mb-2">• {reward}</div>
        ))}
      </div>
    </div>
  );
};

export default T4GSection; 