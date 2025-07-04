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

export function UserInfoForm({ onSubmit }: UserInfoFormProps) {
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
      <input name="fullName" placeholder="checkout.checkoutcheckoutnom_complet" value={form.fullName} onChange={handleChange} className="input" />
      <input name="email" placeholder="checkout.checkoutcheckoutemail" value={form.email} onChange={handleChange} className="input" />
      <input name="address" placeholder="checkout.checkoutcheckoutadresse" value={form.address} onChange={handleChange} className="input" />
      <input name="city" placeholder="checkout.checkoutcheckoutville" value={form.city} onChange={handleChange} className="input" />
      <input name="postalCode" placeholder="checkout.checkoutcheckoutcode_postal" value={form.postalCode} onChange={handleChange} className="input" />
      <input name="country" placeholder="checkout.checkoutcheckoutpays" value={form.country} onChange={handleChange} className="input" />
      <input name="phone" placeholder="checkout.checkoutcheckouttlphone" value={form.phone} onChange={handleChange} className="input" />
      {error && <div className="text-red-500">{error}</div>}
      <button type="submit" className="btn-primary w-full">{t('checkout.procder_au_paiement')}</button>
    </form>
  );
}
export const dynamic = "force-dynamic";
