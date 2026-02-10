import { docs } from '@/.source';
import { loader } from 'fumadocs-core/source';

const mdxSource = docs.toFumadocsSource();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const files = typeof (mdxSource as any).files === 'function'
  ? (mdxSource as any).files()
  : (mdxSource as any).files;

export const source = loader({
  baseUrl: '/docs',
  source: { files },
});
