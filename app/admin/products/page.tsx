export default function ProductsPage(): JSX.Element {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Produits</h1>
      <p>{t('admin.grez_les_produits_proposs_sur_')}</p>
    </div>
  );
}
export const dynamic = "force-dynamic";
