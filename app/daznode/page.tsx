import DazNodePage from './components/DazNodePage';

export const dynamic = 'force-dynamic';
// Export des métadonnées pour le SEO
export { metadata } from './metadata';

export default function Page() {
  return <DazNodePage />;
}
