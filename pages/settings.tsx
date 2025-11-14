import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@heroui/button';

export default function Settings(): JSX.Element {
  const router = useRouter();
  const [perPage, setPerPage] = useState<number>(10);
  const [provider, setProvider] = useState<string>('google');
  const [safeSearch, setSafeSearch] = useState<boolean>(false);

  useEffect(() => {
    // load saved settings
    if (typeof window === 'undefined') return;
    const savedPer = Number(localStorage.getItem('per_page') || 10);
    const savedProvider = localStorage.getItem('provider') || 'google';
    const savedSafe = localStorage.getItem('safe_search') === 'true';
    setPerPage(savedPer);
    setProvider(savedProvider);
    setSafeSearch(savedSafe);
  }, []);

  function saveSettings() {
    if (typeof window === 'undefined') return;
    localStorage.setItem('per_page', String(perPage));
    localStorage.setItem('provider', provider);
    localStorage.setItem('safe_search', String(safeSearch));
    // keep user on settings but show a short toast could be added. For now navigate back to results if there's a query.
    const q = typeof router.query.q === 'string' ? router.query.q : '';
    if (q) router.push({ pathname: '/results', query: { q, per_page: perPage } });
  }

  return (
    <div className="max-w-3xl mx-auto my-12 px-4">
      <h2 className="text-2xl font-semibold mb-4">Réglages de recherche</h2>

      <div className="space-y-4">
        <label className="block">
          <div className="text-sm text-default-400">Résultats par page</div>
          <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))} className="mt-2 p-2 bg-neutral-800 rounded">
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </label>

        <label className="block">
          <div className="text-sm text-default-400">Fournisseur</div>
          <select value={provider} onChange={(e) => setProvider(e.target.value)} className="mt-2 p-2 bg-neutral-800 rounded">
            <option value="google">Google Custom Search</option>
            <option value="serpapi">SerpApi</option>
          </select>
        </label>

        <label className="flex items-center gap-3">
          <input type="checkbox" checked={safeSearch} onChange={(e) => setSafeSearch(e.target.checked)} />
          <span className="text-sm text-default-400">Activer Safe Search</span>
        </label>

        <div>
          <Button onClick={saveSettings}>Enregistrer</Button>
        </div>
      </div>
    </div>
  );
}
