"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/theme-toggle";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="w-full px-6 pt-6 md:px-8 md:pt-8">
      <div className="flex w-full items-center justify-between gap-4 dark:gap-0 dark:items-start">
        <div>
          {!isHome && (
            <Link
              href="/"
              className="text-[0.95rem] text-muted-foreground transition-colors hover:text-foreground dark:text-sm dark:text-foreground dark:font-mono dark:hover:font-bold dark:hover:text-foreground"
            >
              Anish
            </Link>
          )}
        </div>
        <div className="flex items-center justify-end">
          <ThemeToggle />
          {/*<Link href="/weeks" className="font-mono text-sm hover:font-bold">*/}
          {/*  weeks*/}
          {/*</Link>*/}
        </div>
      </div>
    </header>
  );
}
