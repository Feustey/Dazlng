"use client";
import React from "react";

export default function Loading(): JSX.Element {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-2"></span>
      <span>{t('auth.chargement_du_formulaire_de_vr')}</span>
    </div>
  );
}
