export default function SettingsPage(): JSX.Element {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{t('settings.paramtres')}</h1>
      <p>{t('settings.configurez_les_paramtres_gnrau')}</p>
    </div>
  );
}
export const dynamic = "force-dynamic";
