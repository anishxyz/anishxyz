"use client";

import Age from "@/components/Age";

export default function Footer() {
  return (
    <footer className="w-full px-6 pb-6 md:px-8 md:pb-8">
      <div className="flex w-full items-center justify-between gap-4 text-[0.9rem] text-footer-foreground dark:gap-0 dark:text-sm dark:font-mono">
        <div>📍 san francisco</div>
        <div className="text-right">
          <Age />
        </div>
      </div>
    </footer>
  );
}
