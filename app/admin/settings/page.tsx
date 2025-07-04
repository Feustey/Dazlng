import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

export default function SettingsPage(): JSX.Element {
  const { t } = useAdvancedTranslation("settings");
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{t("settings.paramtres")}</h1>
      <p>{t("settings.configurez_les_paramtres_gnrau")}</p>
    </div>
  );
}
