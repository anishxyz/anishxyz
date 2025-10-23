import React from 'react'
import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    wrapper: (props) => <div className="font-mono text-sm leading-loose space-y-4" {...props} />,
    p: (props) => <p {...props} />,
    a: (props) => {
        const href = props.href || ''
        const isExternal = href.startsWith('http')

        if (isExternal) {
          return (
            <a
              className="hover:font-bold text-[oklch(0.75_0.161_238.29)]"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          )
        }

        return (
          <Link href={href} legacyBehavior>
            <a className="hover:font-bold text-[#C50]" {...props} />
          </Link>
        )
      },
    h1: (props) => <h1 className="text-xl font-semibold mt-6 mb-3" {...props} />,
    h2: (props) => (
      <h2
        className="text-lg font-semibold mt-6 mb-3"
        {...props}
      />
    ),
    h3: (props) => (
      <h3 className="text-base font-semibold tracking-wide mt-5 mb-2 uppercase" {...props} />
    ),
    h4: (props) => (
      <h4 className="text-base font-medium mt-4 mb-2 italic text-foreground/90" {...props} />
    ),
    h5: (props) => (
      <h5 className="text-sm font-semibold mt-3 mb-1 uppercase tracking-wide" {...props} />
    ),
    h6: (props) => (
      <h6 className="text-xs font-semibold mt-3 mb-1 uppercase tracking-widest text-foreground/70" {...props} />
    ),
    ul: (props) => <ul className="list-disc ml-6" {...props} />,
    li: (props) => <li {...props} />,
    hr: (props) => <hr className="border-[#666] border-dashed" {...props} />,
    blockquote: (props) => (
      <blockquote
        className="border-l-2 border-[#C50] bg-[#C50]/5 px-4 py-2 text-sm italic text-foreground/80"
        {...props}
      />
    ),
  }
}
