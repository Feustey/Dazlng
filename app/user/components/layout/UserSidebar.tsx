import React from "react";
import Link from \next/link";
import { useLocale } from \next-intl"";

const UserSidebar: React.FC = () => {
  const locale = useLocale();

  return (
    <aside></aside>
      <div></div>
        <nav></nav>
          <Link href="/user/dashboard" locale={locale} className="hover:text-indigo-600">{t("user.tableau_de_bord")}</Link>
          <Link href="/user/node" locale={locale} className="hover:text-indigo-600">{t("user.mon_nud")}</Link>
          <Link href="/user/subscriptions" locale={locale} className="hover:text-indigo-600">Abonnements</Link>
          <Link href="/user/settings" locale={locale} className="hover:text-indigo-600">{t("user.paramtres")}</Link>
        </nav>
      </div>
    </aside>);;

export default UserSidebar;export const dynamic  = "force-dynamic";
