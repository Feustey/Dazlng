import { useTranslations } from "next-intl";

export const ProgressBar = () => {
  const t = useTranslations("Checkout");
  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex items-center justify-between relative">
        {/* Ligne de progression */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-accent/20 -translate-y-1/2" />
        <div className="absolute top-1/2 left-0 w-full h-1 bg-primary -translate-y-1/2 transition-all duration-500" />

        {/* Étapes */}
        <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground shadow-lg">
          <span className="text-sm font-medium">1</span>
        </div>
        <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground shadow-lg">
          <span className="text-sm font-medium">2</span>
        </div>
        <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground shadow-lg">
          <span className="text-sm font-medium">3</span>
        </div>
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-2">
        <span className="text-sm font-medium text-primary">
          {t("delivery")}
        </span>
        <span className="text-sm font-medium text-primary">{t("payment")}</span>
        <span className="text-sm font-medium text-primary">
          {t("confirmation")}
        </span>
      </div>
    </div>
  );
};
