import { IndexView, indexMetadata } from '@/components/changelog/index-view';

// Re-rendered daily so a pinned entry drops its pin after its deadline (Pacific time).
export const revalidate = 86400;
export const metadata = indexMetadata(1);

export default function ChangelogPage() {
  return <IndexView page={1} />;
}
