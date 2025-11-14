import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

import { Logo, SearchIcon, CogIcon } from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";

export function Navbar(): JSX.Element {
  const router = useRouter();
  const [q, setQ] = useState("");

  useEffect(() => {
    const param = typeof router.query.q === "string" ? router.query.q : "";
    if (param) setQ(param);
  }, [router.query.q]);

  async function doSearch(e?: React.FormEvent) {
    e && e.preventDefault();
    const trimmed = q.trim();
    // Update the URL query without a full reload
    router.replace({ pathname: "/", query: trimmed ? { q: trimmed } : {} }, undefined, { shallow: true });
  }

  return (
    <header className="w-full border-b bg-neutral-900/60 backdrop-blur-sm text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-3">
          <Logo size={32} className="text-primary" />
          <span className="hidden sm:inline font-semibold">TheOnlyWebRecherche</span>
        </Link>

        <form onSubmit={doSearch} className="flex-1">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-default-400">
                <SearchIcon />
              </span>
              <Input
                aria-label="Recherche"
                value={q}
                onChange={(e) => setQ((e as any).target.value)}
                placeholder="Rechercher sur le web..."
                type="search"
                className="pl-10 w-full bg-neutral-800 border-neutral-700 text-white"
                autoComplete="off"
                spellCheck="false"
              />
            </div>
            <Button type="submit" className="whitespace-nowrap hidden sm:inline-flex">
              Rechercher
            </Button>
          </div>
        </form>

        <div className="flex items-center gap-3">
          <ThemeSwitch />
          <Link href="/settings" className="p-2 rounded hover:bg-neutral-800/50">
            <CogIcon size={18} className="text-default-300" />
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-default-600 hover:text-default-800"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
