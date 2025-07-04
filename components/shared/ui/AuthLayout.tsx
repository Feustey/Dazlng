import React from "react";
import Image from \next/image";
import { useTranslations } from \next-intl"";


export interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  showLogo?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({children, 
  title, 
  subtitle, 
  showLogo = true 
}) => {
  return (</AuthLayoutProps>
    <div></div>
      <div>
        {/* Logo  */}
        {showLogo && (</div>
          <div></div>
            <Image></Image>
          </div>
        )}

        {/* Titre  */}
        <h1>
          {title}</h1>
        </h1>

        {/* Sous-titre  */}
        <p>
          {subtitle}</p>
        </p>

        {/* Contenu principal  */}
        {children}

        {/* Note confidentialité  */}
        <p></p>
          Vos données sont protégées et ne seront jamais partagées.<br></br>
          <span className="italic">{t("AuthLayout.besoin_daide_contacteznous")}</span>
        </p>
      </div>
    </div>);;

export default AuthLayout; 