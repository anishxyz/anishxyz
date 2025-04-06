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
              className="hover:font-bold italic"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          )
        }

        return (
          <Link href={href} legacyBehavior>
            <a className="hover:font-bold italic" {...props} />
          </Link>
        )
      },
    h1: (props) => <h1 className="text-3xl font-bold mt-6 mb-3" {...props} />,
    h2: (props) => <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />,
    h3: (props) => <h3 className="text-xl font-bold mt-4 mb-2" {...props} />,
    h4: (props) => <h4 className="text-lg font-bold mt-4 mb-2" {...props} />,
    h5: (props) => <h5 className="text-base font-bold mt-2 mb-1" {...props} />,
    h6: (props) => <h6 className="text-sm font-bold mt-2 mb-1" {...props} />,
    ul: (props) => <ul className="list-disc ml-6" {...props} />,
    li: (props) => <li {...props} />,
    hr: (props) => <hr className="border-[#666] border-dashed" {...props} />,
  }
}
