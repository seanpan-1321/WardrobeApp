"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useWardrobe } from "@/lib/wardrobe-context";

const links = [
  { href: "/", label: "Home" },
  { href: "/clothes", label: "My Clothes" },
  { href: "/create-outfit", label: "Create Outfit" },
];

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <circle cx="8" cy="8" r="2.5" />
      <line x1="8" y1="1" x2="8" y2="3" />
      <line x1="8" y1="13" x2="8" y2="15" />
      <line x1="1" y1="8" x2="3" y2="8" />
      <line x1="13" y1="8" x2="15" y2="8" />
      <line x1="3.05" y1="3.05" x2="4.46" y2="4.46" />
      <line x1="11.54" y1="11.54" x2="12.95" y2="12.95" />
      <line x1="12.95" y1="3.05" x2="11.54" y2="4.46" />
      <line x1="4.46" y1="11.54" x2="3.05" y2="12.95" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M13.5 10A6 6 0 016.5 3a6.5 6.5 0 100 10 6 6 0 007-3z" />
    </svg>
  );
}

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useWardrobe();

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <nav className="flex items-center justify-between border-b border-warm-border bg-surface px-6 py-3">
      <Link href="/" className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
        Wardrobe
      </Link>

      <div className="flex items-center gap-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950"
                  : "text-zinc-600 hover:bg-surface-hover dark:text-zinc-400"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-surface-hover hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>

        {user && (
          <>
            <span className="max-w-[140px] truncate text-xs text-zinc-500 dark:text-zinc-400">
              {user.email}
            </span>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-surface-hover dark:text-zinc-400"
            >
              Sign out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
