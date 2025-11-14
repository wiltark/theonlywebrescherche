import { useState } from 'react';
import { useRouter } from 'next/router';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';

export default function Home(): JSX.Element {
  const router = useRouter();
  const [q, setQ] = useState('');

  function doSearch(e?: React.FormEvent) {
    e && e.preventDefault();
    const term = q.trim();
    if (!term) return;
    router.push({ pathname: '/results', query: { q: term } });
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-3xl h-[25vh] flex flex-col items-center justify-center">
        <h1 className="text-4xl font-extrabold mb-4">Recherche sur le Web</h1>
        <p className="text-base text-default-400 mb-6">Tapez ce que vous cherchez et obtenez des résultats rapides.</p>

        <form onSubmit={doSearch} className="w-full flex items-center gap-3">
          <Input
            aria-label="Recherche"
            value={q}
            onChange={(e) => setQ((e as any).target.value)}
            placeholder="Tapez votre recherche..."
            type="search"
            className="flex-1 bg-neutral-800 border-neutral-700 text-white pl-6 py-4 rounded-full text-lg"
            autoComplete="off"
            spellCheck="false"
          />
          <Button type="submit" className="hidden sm:inline-flex">Rechercher</Button>
        </form>
      </div>
    </div>
  );
}
