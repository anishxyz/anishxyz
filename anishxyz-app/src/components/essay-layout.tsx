import type { ReactNode } from "react";

type EssayLayoutProps = {
  title: string;
  date: string;
  subtitle?: string;
  author?: string;
  children: ReactNode;
};

export default function EssayLayout({
  title,
  subtitle,
  date,
  author = "Anish Agrawal",
  children,
}: EssayLayoutProps) {
  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-base font-semibold">{title}</h1>
        {subtitle ? (
          <p className="text-sm text-foreground/80">{subtitle}</p>
        ) : null}
        <div className="text-xs uppercase tracking-wide text-footer-foreground">
          By {author} · {date}
        </div>
      </header>
      <div className="space-y-4">{children}</div>
    </article>
  );
}
