import React, { useState } from 'react';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // TODO: Implémenter la logique de connexion
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-white mb-2">Connexion</h1>
        <p className="text-base text-gray-300 mb-8">Accédez à votre espace personnel</p>
        <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleLogin(); }}>
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Email</label>
            <input
              className="bg-gray-800 rounded-lg p-4 text-white text-base w-full focus:outline-none focus:ring-2 focus:ring-primary"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="votre@email.com"
              type="email"
              autoComplete="email"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Mot de passe</label>
            <input
              className="bg-gray-800 rounded-lg p-4 text-white text-base w-full focus:outline-none focus:ring-2 focus:ring-primary"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          <div className="flex justify-end">
            <a href="#" className="text-primary text-sm hover:underline">Mot de passe oublié&nbsp;?</a>
          </div>
          <button
            type="submit"
            className="w-full bg-primary rounded-lg p-4 text-lg font-semibold text-white mt-2 hover:bg-primary/90 transition"
          >
            Se connecter
          </button>
          <div className="flex justify-center items-center mt-4 gap-1">
            <span className="text-gray-300 text-sm">Pas encore de compte&nbsp;?</span>
            <a href="#" className="text-primary text-sm font-semibold hover:underline">S'inscrire</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen; 