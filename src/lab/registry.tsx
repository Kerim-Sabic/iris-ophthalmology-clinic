import type { ReactNode } from 'react';
import { Lab02 } from './Lab02';
import { Lab03 } from './Lab03';
import { Lab04 } from './Lab04';
import { Lab05 } from './Lab05';
import { Lab06 } from './Lab06';
import { Lab07 } from './Lab07';
import { Lab08 } from './Lab08';

/** Studio id → implemented component. Studios not listed here render their truthful "planned" page. */
const IMPLEMENTED: Record<string, (p: { query: URLSearchParams }) => ReactNode> = {
  LAB02: () => <Lab02 />,
  LAB03: () => <Lab03 />,
  LAB04: () => <Lab04 />,
  LAB05: () => <Lab05 />,
  LAB06: () => <Lab06 />,
  LAB07: () => <Lab07 />,
  LAB08: () => <Lab08 />,
};

export default function StudioRouter({ id, query, fallback }: { id: string; query: URLSearchParams; fallback: ReactNode }) {
  const C = IMPLEMENTED[id];
  return <>{C ? <C query={query} /> : fallback}</>;
}
