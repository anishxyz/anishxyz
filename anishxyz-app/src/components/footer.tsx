"use client";

import Age from "@/components/Age";

export default function Footer() {
  return (
    <footer className="w-full px-6 pb-6 md:px-8 md:pb-8">
      <div className="flex w-full items-center justify-between font-mono text-sm text-footer-foreground">
        <div>📍 san francisco</div>
        <div className="text-right">
          <Age />
        </div>
      </div>
    </footer>
  );
}
