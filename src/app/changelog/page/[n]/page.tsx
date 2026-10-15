import { notFound } from 'next/navigation';
import { IndexView, indexMetadata, pageCount } from '@/components/changelog/index-view';

export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return Array.from({ length: pageCount() - 1 }, (_, i) => ({ n: String(i + 2) }));
}

const parse = async (params: Promise<{ n: string }>) => {
  const n = Number((await params).n);
  if (!Number.isInteger(n) || n < 2 || n > pageCount()) notFound();
  return n;
};

export async function generateMetadata({ params }: { params: Promise<{ n: string }> }) {
  return indexMetadata(await parse(params));
}

export default async function ChangelogPageN({ params }: { params: Promise<{ n: string }> }) {
  return <IndexView page={await parse(params)} />;
}
