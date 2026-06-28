"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useWardrobe } from "@/lib/wardrobe-context";

const links = [
  { href: "/", label: "Home" },
  { href: "/clothes", label: "My Clothes" },
  { href: "/create-outfit", label: "Create Outfit" },
];

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useWardrobe();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <nav className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-3 dark:border-zinc-800 dark:bg-zinc-950">
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
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {user && (
        <div className="flex items-center gap-3">
          <span className="max-w-[140px] truncate text-xs text-zinc-500 dark:text-zinc-400">
            {user.email}
          </span>
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
          >
            Sign out
          </button>
        </div>
      )}
    </nav>
  );
}
