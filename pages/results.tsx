import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Link as HLink } from '@heroui/link';

interface SearchItem {
  title: string;
  link: string;
  snippet?: string;
}

export default function Results(): JSX.Element {
  const router = useRouter();
  const q = typeof router.query.q === 'string' ? router.query.q : '';
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [perPage, setPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    // read per_page and page from query or localStorage
    const qpPer = typeof router.query.per_page === 'string' ? parseInt(router.query.per_page, 10) : undefined;
    const qpPage = typeof router.query.page === 'string' ? parseInt(router.query.page, 10) : undefined;
    const savedPer = typeof window !== 'undefined' ? Number(localStorage.getItem('per_page') || 10) : 10;
    setPerPage(qpPer || savedPer || 10);
    setPage(qpPage && qpPage > 0 ? qpPage : 1);

    if (!q) return;
    let mounted = true;
    async function fetchResults() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        if (mounted) setResults(data.items || []);
      } catch (err: any) {
        if (mounted) setError(err?.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchResults();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, router.query.per_page, router.query.page]);

  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
      <div className="mb-6">
        <p className="text-sm text-default-400">Résultats pour <strong>"{q}"</strong></p>
      </div>

      {loading && <div className="text-default-400">Chargement...</div>}
      {error && <div className="text-red-600">Erreur: {error}</div>}

      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-default-400">Affichage {perPage} par page • page {page}</div>
        <div className="text-sm">
          <label className="mr-2">Par page:</label>
          <select
            value={perPage}
            onChange={(e) => {
              const v = Number(e.target.value);
              localStorage.setItem('per_page', String(v));
              router.replace({ pathname: '/results', query: { q, per_page: v, page: 1 } });
            }}
            className="bg-neutral-800 p-1 rounded"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {results.slice((page - 1) * perPage, page * perPage).map((it, idx) => (
          <div key={it.link ?? idx} className="">
            <div className="text-sm text-success mb-1">{it.link}</div>
            <HLink href={it.link} isExternal className="text-xl text-primary font-medium">{it.title}</HLink>
            <p className="text-base text-default-600 mt-1">{it.snippet}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          className="px-3 py-1 bg-neutral-800 rounded disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => router.replace({ pathname: '/results', query: { q, per_page: perPage, page: page - 1 } })}
        >
          Préc
        </button>

        <div className="text-sm text-default-400">{Math.max(1, Math.ceil(results.length / perPage))} pages</div>

        <button
          className="px-3 py-1 bg-neutral-800 rounded disabled:opacity-50"
          disabled={page >= Math.ceil(results.length / perPage)}
          onClick={() => router.replace({ pathname: '/results', query: { q, per_page: perPage, page: page + 1 } })}
        >
          Suiv
        </button>
      </div>
    </div>
  );
}
