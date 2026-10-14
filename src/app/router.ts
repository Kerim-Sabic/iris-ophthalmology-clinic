import { useEffect, useState } from 'react';

export interface Route {
  path: string[];
  query: URLSearchParams;
  raw: string;
}

function parse(): Route {
  const h = location.hash.replace(/^#\/?/, '');
  const [p, q] = h.split('?');
  return { path: p.split('/').filter(Boolean).map(decodeURIComponent), query: new URLSearchParams(q ?? ''), raw: h };
}

export function useRoute(): Route {
  const [r, setR] = useState(parse);
  useEffect(() => {
    const h = () => setR(parse());
    addEventListener('hashchange', h);
    return () => removeEventListener('hashchange', h);
  }, []);
  return r;
}

export function go(path: string) {
  location.hash = path.startsWith('#') ? path : '#/' + path.replace(/^\//, '');
}

export function href(path: string) {
  return '#/' + path.replace(/^\//, '');
}
