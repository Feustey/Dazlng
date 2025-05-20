"use client";

import React, { useEffect, useState } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface UserData {
  name: string;
  email: string;
}

interface Order {
  id: string;
  date: string;
  amount: number;
  status: string;
  items: { name: string; quantity: number; price: number }[];
}

const supabase = createClientComponentClient();

const UserPage: React.FC = () => {
  const [user, setUser] = useState<UserData>({ name: "", email: "" });
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(user);
  const [pwd, setPwd] = useState({ current: "", new: "", confirm: "" });
  const [pwdMsg, setPwdMsg] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  // Récupère les infos utilisateur
  useEffect(() => {
    async function fetchUserData(): Promise<UserData> {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch("/api/user", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.json();
    }

    fetchUserData().then(data => {
      setUser(data);
      setForm(data);
    });
    fetch("/api/orders")
      .then(res => res.json())
      .then(setOrders);
  }, []);

  const handleSave = async (): Promise<void> => {
    const res = await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data);
      setEdit(false);
    }
  };

  const handlePwdChange = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (pwd.new !== pwd.confirm) {
      setPwdMsg("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
    const res = await fetch("/api/user/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current: pwd.current, next: pwd.new }),
    });
    if (res.ok) {
      setPwdMsg("Mot de passe modifié avec succès !");
      setPwd({ current: "", new: "", confirm: "" });
    } else {
      const err = await res.json();
      setPwdMsg(err.error || "Erreur lors du changement de mot de passe.");
    }
  };

  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Mon espace utilisateur</h1>

      {/* Infos personnelles */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Informations personnelles</h2>
        {edit ? (
          <div className="space-y-4">
            <input
              className="w-full p-3 rounded-lg border border-gray-300"
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Nom"
            />
            <input
              className="w-full p-3 rounded-lg border border-gray-300"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
            />
            <div className="flex gap-4">
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded-lg"
                onClick={handleSave}
              >
                Sauvegarder
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg"
                onClick={() => { setEdit(false); setForm(user); }}
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p><span className="font-medium">Nom :</span> {user.name}</p>
            <p><span className="font-medium">Email :</span> {user.email}</p>
            <button
              className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg"
              onClick={() => setEdit(true)}
            >
              Modifier mes informations
            </button>
          </div>
        )}
      </section>

      {/* Changement de mot de passe */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Changer mon mot de passe</h2>
        <form className="space-y-4" onSubmit={handlePwdChange}>
          <input
            className="w-full p-3 rounded-lg border border-gray-300"
            type="password"
            value={pwd.current}
            onChange={e => setPwd({ ...pwd, current: e.target.value })}
            placeholder="Mot de passe actuel"
            required
          />
          <input
            className="w-full p-3 rounded-lg border border-gray-300"
            type="password"
            value={pwd.new}
            onChange={e => setPwd({ ...pwd, new: e.target.value })}
            placeholder="Nouveau mot de passe"
            required
          />
          <input
            className="w-full p-3 rounded-lg border border-gray-300"
            type="password"
            value={pwd.confirm}
            onChange={e => setPwd({ ...pwd, confirm: e.target.value })}
            placeholder="Confirmer le nouveau mot de passe"
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg"
          >
            Modifier le mot de passe
          </button>
          {pwdMsg && (
            <p className={`mt-2 ${pwdMsg.includes('succès') ? 'text-green-600' : 'text-red-600'}`}>{pwdMsg}</p>
          )}
        </form>
      </section>

      {/* Commandes */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Mes commandes</h2>
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="border rounded-lg p-4 bg-white/5">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Commande {order.id}</span>
                <span className="text-sm text-gray-400">{order.date}</span>
              </div>
              <div className="mb-2">
                <span className="text-sm">Statut : </span>
                <span className="font-medium">{order.status}</span>
              </div>
              <ul className="mb-2 text-sm">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} × {item.quantity} — <span className="font-medium">{item.price} sats</span>
                  </li>
                ))}
              </ul>
              <div className="font-bold">Total : {order.amount} sats</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default UserPage;
