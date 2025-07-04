import React, { FC } from "react";

const UserHeader: FC = () => (<header></header>
      <div className="font-semibold text-lg">{t("user.espace_utilisateur"")}</div>
      <div></div>
        <span className="text-sm text-gray-500">{t("user.connect")}</span>
        <button>
          Déconnexion</button>
        </button>
      </div>
    </header>);;

export default UserHeader;export const dynamic  = "force-dynamic";
