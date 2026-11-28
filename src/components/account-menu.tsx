'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { SITE_URL } from '@/lib/site';
import { NavIconSvg } from '@/components/blog/nav-icons';

type IconName = Parameters<typeof NavIconSvg>[0]['name'];

/**
 * The affitor.com account menu for the blog, changelog and docs headers: a 32 px disc that opens the
 * same panel and rows as the dashboard's public header (apps/web AccountMenu, variant "public"):
 *   brand:   Dashboard · Switch to partner (or Become a partner) · Refer a brand · Docs · Feedback · Log out
 *   partner: Dashboard · Switch to brand (or Create a program) · Docs · Feedback · Log out
 * The pages share the affitor.com origin with the dashboard, so the person is read from the same
 * `GET /api/users/me?optional=1` probe the dashboard uses, and the side from the same session context.
 * `ph-no-capture` on the container: PostHog autocapture never records a click inside it (name, email).
 */

type Me = {
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  avatar_url?: string | null;
  affiliateRole?: string | null;
  affiliate_role?: string | null;
  advertiser?: object | null;
  partner?: object | null;
} | null;
type Side = 'brand' | 'partner' | null;

const CONTEXT_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
const WINDOW_W = 480;
const WINDOW_H = 560;
const GRADIENTS = [
  ['#a5f3fc', '#3b82f6', '#6d28d9'], ['#fde68a', '#f97316', '#db2777'], ['#bbf7d0', '#10b981', '#0e7490'],
  ['#e9d5ff', '#8b5cf6', '#1e3a8a'], ['#fecdd3', '#f43f5e', '#7c3aed'], ['#bae6fd', '#0ea5e9', '#0f766e'],
  ['#fef08a', '#84cc16', '#047857'], ['#fbcfe8', '#ec4899', '#9333ea'],
] as const;

const menuItemClass = 'flex h-8 w-full items-center gap-2 rounded-[4px] px-2 text-left text-[14px] leading-5 text-[#262626] no-underline hover:bg-[#f1f3f5] focus-visible:bg-[#f1f3f5] focus-visible:outline-none max-sm:h-11 max-sm:gap-3';
const menuIconClass = 'flex h-5 w-5 shrink-0 items-center justify-center text-[#6a7383] [&>svg]:h-4 [&>svg]:w-4';
const panelClass = 'overflow-hidden z-50 rounded-[8px] border border-[#e3e8ee] bg-white text-left shadow-[0_12px_32px_rgba(16,24,40,0.12),0_2px_6px_rgba(16,24,40,0.05)] [&>*+*]:border-t [&>*+*]:border-[#e3e8ee]';
const iconButtonClass = 'relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] text-[#6a7383] hover:bg-[#f1f3f5] hover:text-[#262626] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155dfc]';

const hasObject = (v: unknown) => !!v && typeof v === 'object' && Object.keys(v as object).length > 0;
const roleOf = (me: Me) => (me?.affiliateRole || me?.affiliate_role || '').toLowerCase();
const isPartner = (me: Me) => hasObject(me?.partner) || ['affiliate_partner', 'both'].includes(roleOf(me));
const isBrand = (me: Me) => hasObject(me?.advertiser) || ['advertiser', 'both'].includes(roleOf(me));

/** The side used last (the dashboard's session context), else the one side the account has. */
function sideOf(me: Me): Side {
  let best: { side: Side; at: number } = { side: null, at: 0 };
  for (const [key, side] of [['advertiser_session_context', 'brand'], ['partner_session_context', 'partner']] as const) {
    try {
      const at = Number(JSON.parse(localStorage.getItem(key) ?? 'null')?.lastAccessed);
      if (at > best.at && Date.now() - at < CONTEXT_MAX_AGE_MS) best = { side, at };
    } catch {
      // unreadable context: ignore it
    }
  }
  if (best.side) return best.side;
  const brand = isBrand(me), partner = isPartner(me);
  return brand === partner ? null : brand ? 'brand' : 'partner';
}

function displayName(me: Me, email: string): string {
  const name = [me?.first_name?.trim(), me?.last_name?.trim()].filter(Boolean).join(' ');
  return name || email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function gradient(seed: string): string {
  let h = 2166136261;
  for (const c of seed.trim().toLowerCase()) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const [a, b, c] = GRADIENTS[(h >>> 0) % GRADIENTS.length];
  return `linear-gradient(135deg, ${a} 0%, ${b} 55%, ${c} 100%)`;
}

function Avatar({ seed, photo }: { seed: string; photo?: string | null }) {
  if (photo) return <img src={photo} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" referrerPolicy="no-referrer" />;
  return <span aria-hidden="true" data-avatar="gradient" className="inline-block h-8 w-8 shrink-0 rounded-full shadow-[inset_0_0_0_1px_rgba(16,24,40,0.08)]" style={{ backgroundImage: gradient(seed) }} />;
}

/** The feedback window: a fresh noopener window, centred over this one; a tab on phones. */
function openFeedbackWindow(): void {
  const page = window.location.pathname.slice(0, 300);
  const phone = window.matchMedia('(max-width: 639px)').matches;
  const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - WINDOW_W) / 2));
  const top = Math.max(0, Math.round(window.screenY + (window.outerHeight - WINDOW_H) / 2));
  const size = phone ? '' : `,popup=yes,width=${WINDOW_W},height=${WINDOW_H},left=${left},top=${top}`;
  window.open(`${SITE_URL}/feedback?${new URLSearchParams({ page, view: 'window' })}`, '_blank', `noopener,noreferrer${size}`);
}

/** Who is signed in, from the dashboard's own page-load probe. undefined = loading, null = nobody. */
function useMe(): Me | undefined {
  const [me, setMe] = useState<Me | undefined>(undefined);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/users/me?optional=1', { credentials: 'same-origin', cache: 'no-store', signal: controller.signal, headers: { Accept: 'application/json' } })
      .then((r) => (r.ok ? r.json() : null))
      .then((body: Me) => setMe(body && typeof body === 'object' ? body : null))
      .catch((e: unknown) => { if ((e as Error)?.name !== 'AbortError') setMe(null); });
    return () => controller.abort();
  }, []);
  return me;
}

type Row = { label: string; href: string; icon: IconName; hint?: string };

export function AccountMenu() {
  const me = useMe();
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState<Side>(null);
  const ref = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => { setOpen(false); trigger.current?.focus(); }, []);

  useEffect(() => { if (me) setSide(sideOf(me)); }, [me]);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) close(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open, close]);

  if (me === null) return null;
  const email = me?.email?.trim() ?? '';
  const name = me ? displayName(me, email) : '';
  const seed = email || name;
  const at = (path: string) => `${SITE_URL}${path}`;

  const rows: Row[] = [];
  if (side) rows.push({ label: 'Dashboard', href: at(side === 'brand' ? '/brand' : '/partner'), icon: 'columns' });
  if (side === 'brand') {
    rows.push(isPartner(me ?? null)
      ? { label: 'Switch to partner', href: at('/partner/start'), icon: 'refresh' }
      : { label: 'Become a partner', href: at('/marketplace'), icon: 'globe', hint: 'Promote other programs and get paid. Opens the Marketplace.' });
    rows.push({ label: 'Refer a brand', href: at('/partner/referrals'), icon: 'gift' });
  } else if (side === 'partner') {
    rows.push({ label: 'Switch to brand', href: at('/brand'), icon: 'refresh' });
  }

  const logout = async () => {
    close();
    // Same-origin JSON POST, the dashboard's own logout; the login page follows either way.
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: '{}' }).catch(() => undefined);
    window.location.assign(at('/login'));
  };

  const item = (icon: IconName): ReactNode => <span className={menuIconClass}><NavIconSvg name={icon} /></span>;

  return (
    <div ref={ref} className="ph-no-capture relative inline-flex h-8 w-8 shrink-0" data-account-menu>
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={name ? `Account menu, ${name}` : 'Account menu'}
        aria-busy={!name}
        className="inline-flex h-8 w-8 shrink-0 cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155dfc]"
      >
        {name ? <Avatar seed={seed} photo={me?.avatar_url} /> : <span data-avatar="loading" aria-hidden="true" className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-[#f1f3f5]" />}
      </button>
      {open && (
        <div role="dialog" aria-label="Account menu" className={`absolute top-full right-0 mt-2 w-[256px] ${panelClass}`}>
          <div className="flex items-center gap-2.5 py-3 pl-3 pr-2">
            <Avatar seed={seed} photo={me?.avatar_url} />
            <div className="min-w-0 flex-1">
              <b className="block truncate text-[14px] font-semibold leading-5 text-[#262626]">{name}</b>
              {email && <span className="block truncate text-[12px] leading-4 text-[#6a7383]">{email}</span>}
            </div>
            <a href={at('/account')} onClick={close} aria-label="Your account" title="Your account" className={iconButtonClass}>
              <NavIconSvg name="settings" className="h-4 w-4" />
            </a>
          </div>
          <div className="p-1">
            {rows.map((row) => (
              <div key={row.label}>
                <a href={row.href} onClick={close} className={menuItemClass}>{item(row.icon)}{row.label}</a>
                {row.hint && <p className="pb-1.5 pl-9 pr-2 text-[12px] leading-4 text-[#6a7383]">{row.hint}</p>}
              </div>
            ))}
            <a href={at('/docs')} target="_blank" rel="noopener noreferrer" onClick={close} className={menuItemClass}>
              {item('book')}Docs
              <NavIconSvg name="external" className="ml-auto h-3.5 w-3.5 shrink-0 text-[#6a7383]" />
            </a>
            <button type="button" onClick={() => { close(); openFeedbackWindow(); }} className={menuItemClass}>
              {item('message')}Feedback
            </button>
          </div>
          <div className="p-1">
            <button type="button" onClick={() => { void logout(); }} className={menuItemClass}>Log out</button>
          </div>
        </div>
      )}
    </div>
  );
}
