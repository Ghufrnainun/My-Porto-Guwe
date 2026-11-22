/** What the post editor (tiptap StarterKit + image + link) can produce. Anything else is dropped. */
const TAGS = new Set([
  'p', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'b', 'em', 'i', 's', 'u', 'code', 'pre',
  'blockquote', 'ul', 'ol', 'li', 'a', 'img',
]);
const SAFE_URL = /^(https?:|mailto:|\/(?!\/))/i;

/**
 * Post HTML comes out of the database, so it is rebuilt from an allowlist before it is put on the page:
 * unknown tags are unwrapped (scripts, styles and frames are removed whole), and only link and image
 * addresses survive as attributes. Browser only: it needs DOMParser.
 */
export function sanitizeHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const out = doc.createElement('div');

  const copy = (from: Node, to: Element) => {
    from.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        to.append(node.textContent ?? '');
        return;
      }
      if (!(node instanceof Element)) return;
      const tag = node.tagName.toLowerCase();
      if (['script', 'style', 'iframe', 'object', 'embed', 'template', 'noscript'].includes(tag)) return;
      if (!TAGS.has(tag)) {
        copy(node, to);
        return;
      }
      const clean = doc.createElement(tag);
      const href = node.getAttribute('href') ?? '';
      const src = node.getAttribute('src') ?? '';
      if (tag === 'a' && SAFE_URL.test(href)) {
        clean.setAttribute('href', href);
        clean.setAttribute('rel', 'noopener noreferrer');
      }
      if (tag === 'img') {
        if (!SAFE_URL.test(src)) return;
        clean.setAttribute('src', src);
        clean.setAttribute('alt', node.getAttribute('alt') ?? '');
        clean.setAttribute('loading', 'lazy');
      }
      copy(node, clean);
      to.append(clean);
    });
  };

  copy(doc.body, out);
  return out.innerHTML;
}
