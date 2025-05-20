import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { storage } from '../utils/storage';

export default function LoginScreen(): React.ReactElement {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (): Promise<void> => {
    try {
      setLoading(true);
      if (form.email && form.password) {
        const mockUser = {
          id: '1',
          email: form.email,
          name: 'Utilisateur Test',
        };
        await storage.setUser(mockUser);
        await storage.setAuth({
          token: 'mock-token-123',
          refreshToken: 'mock-refresh-token-123',
        });
        router.replace('/');
      } else {
        alert('Veuillez remplir tous les champs');
      }
    } catch (error) {
      alert('Une erreur est survenue lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      <div className="flex flex-1 justify-center items-center p-6">
        <div className="w-full max-w-[400px] bg-[#232336cc] rounded-[28px] p-8 border-[1.5px] border-[#F7931A33] shadow-lg">
          <h1 className="text-4xl font-extrabold mb-4 text-secondary text-center tracking-wide font-sans">
            Connexion
          </h1>
          <p className="text-lg text-muted mb-8 text-center font-medium">
            Connectez-vous pour accéder à votre espace personnel
          </p>
          <form className="mb-5" onSubmit={e => { e.preventDefault(); handleLogin(); }}>
            <div className="mb-5">
              <label className="block text-base font-semibold text-text mb-1.5 font-sans">Email</label>
              <input
                className="w-full bg-background border-2 border-gray-400 rounded-[18px] py-3.5 px-5 text-base text-text font-sans mb-1"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="votre@email.com"
                disabled={loading}
                type="email"
                autoComplete="email"
              />
            </div>
            <div className="mb-5">
              <label className="block text-base font-semibold text-text mb-1.5 font-sans">Mot de passe</label>
              <input
                className="w-full bg-background border-2 border-gray-400 rounded-[18px] py-3.5 px-5 text-base text-text font-sans mb-1"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Votre mot de passe"
                disabled={loading}
                type="password"
                autoComplete="current-password"
              />
            </div>
            <button
              className={`w-full bg-secondary py-4 px-9 rounded-[25px] mt-2 font-bold text-primary shadow-lg transition-colors duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-secondary/90'}`}
              disabled={loading}
              type="submit"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
            <p className="text-right text-sm text-muted mt-4 cursor-pointer hover:underline">
              Mot de passe oublié ?
            </p>
          </form>
        </div>
      </div>
    </div>
  );
} 