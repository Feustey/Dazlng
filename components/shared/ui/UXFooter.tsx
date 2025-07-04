import React from "react";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

const UXFooter: React.FC = () => {
  const { t } = useAdvancedTranslation("common");
  
  return (
    <footer>
      <div>
        <div>
          © {new Date().getFullYear()} DazNode. Tous droits réservés.
        </div>
        <div>
          <a href="/terms" className="hover:text-[#F7931A] transition-colors">
            {t("UXFooter.mentions_lgales")}
          </a>
          <a href="/privacy" className="hover:text-[#F7931A] transition-colors">
            {t("UXFooter.confidentialit")}
          </a>
          <a href="mailto:contact@daznode.com" className="hover:text-[#F7931A] transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default UXFooter; 