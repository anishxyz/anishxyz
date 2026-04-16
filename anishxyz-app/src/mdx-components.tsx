import React from 'react'
import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    wrapper: ({ params: _params, searchParams: _searchParams, ...props }) => (
      <div
        className="space-y-4 text-[0.95rem] leading-loose text-foreground md:text-base dark:font-mono dark:text-sm dark:leading-loose dark:md:text-sm dark:md:leading-loose"
        {...props}
      />
    ),
    p: (props) => <p {...props} />,
    strong: (props) => <strong className="font-bold" {...props} />,
    a: (props) => {
        const href = props.href || ''
        const isExternal = href.startsWith('http')

        if (isExternal) {
          return (
            <a
              className="text-[var(--link-external)] underline decoration-[var(--rule)] underline-offset-4 transition-colors hover:text-[var(--link-subtle)] dark:no-underline dark:hover:font-bold dark:hover:text-[var(--link-external)]"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          )
        }

        return (
          <Link href={href} legacyBehavior>
            <a className="text-[var(--link-internal)] underline decoration-[var(--rule)] underline-offset-4 transition-colors hover:text-[var(--link-subtle)] dark:no-underline dark:hover:font-bold dark:hover:text-[var(--link-internal)]" {...props} />
          </Link>
        )
      },
    h1: (props) => <h1 className="mt-6 mb-3 text-xl font-semibold leading-normal" {...props} />,
    h2: (props) => (
      <h2
        className="mt-6 mb-3 text-lg font-semibold leading-normal"
        {...props}
      />
    ),
    h3: (props) => (
      <h3 className="mt-5 mb-2 text-base font-semibold uppercase tracking-wide leading-normal" {...props} />
    ),
    h4: (props) => (
      <h4 className="mt-4 mb-2 text-base font-medium italic text-foreground/90 leading-normal" {...props} />
    ),
    h5: (props) => (
      <h5 className="mt-3 mb-1 text-sm font-semibold uppercase tracking-wide" {...props} />
    ),
    h6: (props) => (
      <h6 className="mt-3 mb-1 text-xs text-foreground/70 uppercase tracking-widest" {...props} />
    ),
    ul: (props) => <ul className="list-disc ml-6 space-y-2 dark:space-y-0" {...props} />,
    li: (props) => <li {...props} />,
    hr: (props) => <hr className="border-[var(--rule)] border-dashed" {...props} />,
    blockquote: (props) => (
      <blockquote
        className="border-l-2 border-[var(--callout-border)] bg-[var(--callout-background)] px-4 py-2 text-sm italic text-foreground/80"
        {...props}
      />
    ),
  }
}
