import React, { useState } from "react";

export type UserInfo = {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
};

export interface UserInfoFormProps {
  onSubmit: (data: UserInfo) => void;
}

export function UserInfoForm({ onSubmit }: UserInfoFormProps): React.FC {
  const [form, setForm] = useState<UserInfo>({
    fullName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.address || !form.city || !form.postalCode || !form.country) {
      setError("Merci de remplir tous les champs obligatoires.");
      return;
    }
    setError("");
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="fullName" placeholder="Nom complet*" value={form.fullName} onChange={handleChange} className="input" />
      <input name="email" placeholder="Email*" value={form.email} onChange={handleChange} className="input" />
      <input name="address" placeholder="Adresse*" value={form.address} onChange={handleChange} className="input" />
      <input name="city" placeholder="Ville*" value={form.city} onChange={handleChange} className="input" />
      <input name="postalCode" placeholder="Code postal*" value={form.postalCode} onChange={handleChange} className="input" />
      <input name="country" placeholder="Pays*" value={form.country} onChange={handleChange} className="input" />
      <input name="phone" placeholder="Téléphone" value={form.phone} onChange={handleChange} className="input" />
      {error && <div className="text-red-500">{error}</div>}
      <button type="submit" className="btn-primary w-full">Procéder au paiement</button>
    </form>
};
}
