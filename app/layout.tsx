import { ReactNode } from "react";

// Puisque le middleware gère la locale, nous n'en avons pas besoin ici
// mais le layout dans [locale] en aura besoin.

type Props = {
  children: ReactNode;
};

// Le layout racine définit simplement la structure HTML de base.
// Le layout dans `app/[locale]/layout.tsx` s'occupera du reste (y compris la langue).
export default function RootLayout({ children }: Props) {
  return (
    // La langue sera définie dans le layout enfant spécifique à la locale
    <html>
      <body>{children}</body>
    </html>
  );
}
