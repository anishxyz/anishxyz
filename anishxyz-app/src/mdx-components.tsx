import React from 'react'
import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    wrapper: ({ params: _params, searchParams: _searchParams, ...props }) => (
      <div
        className="space-y-6 text-[1.05rem] leading-[1.85] text-foreground md:text-[1.1rem] md:leading-[1.95] dark:space-y-4 dark:font-mono dark:text-sm dark:leading-loose dark:md:text-sm dark:md:leading-loose"
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
    h1: (props) => <h1 className="mt-8 mb-4 text-3xl font-semibold leading-tight md:text-4xl dark:mt-6 dark:mb-3 dark:text-xl dark:leading-normal dark:md:text-xl" {...props} />,
    h2: (props) => (
      <h2
        className="mt-8 mb-4 text-2xl font-semibold leading-tight dark:mt-6 dark:mb-3 dark:text-lg dark:leading-normal"
        {...props}
      />
    ),
    h3: (props) => (
      <h3 className="mt-7 mb-3 text-[1.25rem] font-semibold leading-snug dark:mt-5 dark:mb-2 dark:text-base dark:uppercase dark:tracking-wide dark:leading-normal" {...props} />
    ),
    h4: (props) => (
      <h4 className="mt-6 mb-2 text-[1.1rem] italic text-foreground/90 dark:mt-4 dark:text-base dark:font-medium dark:leading-normal" {...props} />
    ),
    h5: (props) => (
      <h5 className="mt-5 mb-2 text-base font-semibold dark:mt-3 dark:mb-1 dark:text-sm dark:uppercase dark:tracking-wide" {...props} />
    ),
    h6: (props) => (
      <h6 className="mt-4 mb-2 text-sm text-muted-foreground dark:mt-3 dark:mb-1 dark:text-xs dark:uppercase dark:tracking-widest dark:text-foreground/70" {...props} />
    ),
    ul: (props) => <ul className="list-disc ml-6 space-y-2 dark:space-y-0" {...props} />,
    li: (props) => <li className="pl-1 dark:pl-0" {...props} />,
    hr: (props) => <hr className="border-[var(--rule)] border-dashed" {...props} />,
    blockquote: (props) => (
      <blockquote
        className="border-l border-[var(--callout-border)] bg-[var(--callout-background)] px-4 py-3 text-[0.98em] italic text-foreground/80 dark:border-l-2 dark:px-4 dark:py-2 dark:text-sm"
        {...props}
      />
    ),
  }
}
