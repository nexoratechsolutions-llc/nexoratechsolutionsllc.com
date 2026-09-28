import { Fragment, cloneElement, createElement, isValidElement } from 'react'

/**
 * Wraps every word of a headline in its own span so the words can rise into
 * place one after another (see .word in base.css). Nested elements such as
 * <em> keep their styling. The text itself is unchanged, so the prerendered
 * <h1> still reads normally to crawlers and screen readers.
 */
function split(node, counter) {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
      .split(/(\s+)/)
      .filter(Boolean)
      .map((part) =>
        /^\s+$/.test(part) ? part : createElement('span', { className: 'word', style: { '--wi': counter.i++ } }, part)
      )
  }
  if (Array.isArray(node)) return node.flatMap((n) => split(n, counter))
  if (isValidElement(node)) return [cloneElement(node, undefined, ...split(node.props.children, counter))]
  return node == null || typeof node === 'boolean' ? [] : [node]
}

export default function WordReveal({ children }) {
  return createElement(Fragment, null, ...split(children, { i: 0 }))
}
