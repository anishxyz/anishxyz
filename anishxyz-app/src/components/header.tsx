"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="w-full px-6 pt-6 md:px-8 md:pt-8">
      <div className="flex w-full items-start justify-between">
        <div>
          {!isHome && (
            <Link href="/" className="font-mono text-sm hover:font-bold">
              Anish
            </Link>
          )}
        </div>
        <div className="text-right">
          <Link href="/e" className="font-mono text-sm hover:font-bold">
            essays
          </Link>
        </div>
      </div>
    </header>
  );
}
