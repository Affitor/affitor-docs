'use client';

import type { AnchorHTMLAttributes } from 'react';
import { publicHref } from '@/config/site-nav';
import { useSignedIn } from '@/lib/signed-in';

/** A link to an affitor.com page that, once signed in, keeps the visitor on the public home (see publicHref). */
export function PublicLink({ href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return <a {...props} href={publicHref(href, useSignedIn())} />;
}
