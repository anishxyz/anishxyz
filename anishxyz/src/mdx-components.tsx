import React from 'react'
import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    // Wrap all MDX content in a div with the desired font, text size, line height, and spacing
    wrapper: (props) => <div className="font-mono text-sm leading-loose space-y-4" {...props} />,
    // Paragraphs remain as-is; you could add extra classes here if needed
    p: (props) => <p {...props} />,
    // Use a consistent style for links – adding hover effects similar to your profile links
    a: (props) => <a className="hover:font-bold italic" {...props} />,
    // Render unordered lists with a disc style and a left margin (1.5rem is roughly ml-6)
    ul: (props) => <ul className="list-disc ml-6" {...props} />,
    // List items can be customized here as well if needed
    li: (props) => <li {...props} />,
    // Horizontal rule styling to match the border color from your profile
    hr: (props) => <hr className="border-[#666]" {...props} />,
  }
}
