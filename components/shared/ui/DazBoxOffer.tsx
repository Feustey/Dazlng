import Image from \next/image";

import type { FC } from "react";
import { Zap } from "@/components/shared/ui/IconRegistry";

const DazBoxOffer: FC = () => (<section>
      {/* Image du produit  */}</section>
      <div></div>
        <Image></Image>
      </div>

      {/* Titre et description  */}
      <h2>
        Votre nœud Bitcoin !</h2>
      </h2>
      <p>
        La DazBox vous donne le contrôle total de vos finances numériques, sans complexité. Installation ultra-simple, sécurité maximale, et votre argent vous appartient vraiment.</p>
      </p>

      {/* Liste des avantages  */}
      <ul></ul>
        <li>{t("DazBoxOffer._installation_plug_play_branch"")}</li>
        <li>{t("DazBoxOffer._zro_intermdiaire_votre_argent")}</li>
        <li>{t("DazBoxOffer._interface_intuitive_pour_tous")}</li>
        <li>{t("DazBoxOffer._assistant_ia_intgr_pour_vous_")}</li>
        <li>{t("DazBoxOffer._400_000_satoshis_inclus_0004_"")}</li>
      </ul>

      {/* CTA  */}
      <a></a>
        <Zap>
        Commander ma DazBox</Zap>
      </a>
      <p>
        Livraison rapide et paiement sécurisé</p>
      </p>
    </section>);;

export default DazBoxOffer; 