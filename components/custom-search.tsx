'use client';

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  type KeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { FileText, Search, Loader2 } from 'lucide-react';

/* -------------------------------------------------- */
/*  Types                                             */
/* -------------------------------------------------- */

interface PageInfo {
  title: string;
  description: string;
  url: string;
}

interface PageGroup {
  category: string;
  pages: PageInfo[];
}

interface SearchResult {
  id: string;
  type: string;
  content: string;
  url: string;
  breadcrumbs?: string[];
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/* -------------------------------------------------- */
/*  Component                                         */
/* -------------------------------------------------- */

export function CustomSearchDialog({ open, onOpenChange }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [groups, setGroups] = useState<PageGroup[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // SSR guard
  useEffect(() => setMounted(true), []);

  // Fetch all pages on first open
  useEffect(() => {
    if (open && groups.length === 0) {
      fetch('/api/pages')
        .then((r) => r.json())
        .then(setGroups)
        .catch(() => {});
    }
  }, [open, groups.length]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?query=${encodeURIComponent(query)}`,
        );
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
      } catch {
        setResults([]);
      }
      setLoading(false);
      setSelectedIndex(0);
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  /* ---------- derived data ---------- */

  // Flat list for keyboard navigation
  const flatItems = useMemo<PageInfo[]>(() => {
    if (query.trim()) {
      const seen = new Set<string>();
      return results
        .filter((r) => {
          if (r.type !== 'page' || seen.has(r.url)) return false;
          seen.add(r.url);
          return true;
        })
        .map((r) => ({ title: r.content, description: '', url: r.url }));
    }
    return groups.flatMap((g) => g.pages);
  }, [query, results, groups]);

  const selectedItem = flatItems[selectedIndex] || null;

  // Preview text
  const previewText = useMemo(() => {
    if (!selectedItem) return '';
    if (query.trim()) {
      const matches = results
        .filter((r) => r.url === selectedItem.url && r.type !== 'page')
        .map((r) => r.content);
      return matches.length > 0 ? matches.slice(0, 4).join(' \u2026 ') : '';
    }
    return selectedItem.description;
  }, [query, selectedItem, results]);

  /* ---------- actions ---------- */

  const navigate = useCallback(
    (url: string) => {
      onOpenChange(false);
      router.push(url);
    },
    [onOpenChange, router],
  );

  // Keep selected item in view
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector('[data-selected="true"]');
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((i) => Math.min(i + 1, flatItems.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((i) => Math.max(i - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedItem) navigate(selectedItem.url);
          break;
        case 'Escape':
          e.preventDefault();
          onOpenChange(false);
          break;
      }
    },
    [flatItems.length, selectedItem, navigate, onOpenChange],
  );

  /* ---------- render ---------- */

  if (!open || !mounted) return null;

  const isDefault = !query.trim();

  const dialog = (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
        }}
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog wrapper — clicking empty area closes (same as ESC) */}
      <div
        role="dialog"
        aria-modal
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: '12vh',
          paddingLeft: 16,
          paddingRight: 16,
        }}
        onKeyDown={handleKeyDown}
        onClick={(e) => {
          if (e.target === e.currentTarget) onOpenChange(false);
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 720,
            overflow: 'hidden',
            borderRadius: 12,
            border: '1px solid var(--color-fd-border)',
            background: 'var(--color-fd-card)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          }}
        >
          {/* ---- Search input ---- */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '0 16px',
              height: 52,
              borderBottom: '1px solid var(--color-fd-border)',
            }}
          >
            <Search
              size={16}
              style={{ color: 'var(--color-fd-muted-foreground)', flexShrink: 0 }}
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search documentation..."
              style={{
                flex: 1,
                background: 'transparent',
                fontSize: '0.875rem',
                color: 'var(--color-fd-foreground)',
                outline: 'none',
                border: 'none',
              }}
            />
            {loading && (
              <Loader2
                size={16}
                className="animate-spin"
                style={{ color: 'var(--color-fd-muted-foreground)' }}
              />
            )}
            <kbd
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '2px 6px',
                borderRadius: 4,
                border: '1px solid var(--color-fd-border)',
                fontSize: 10,
                fontWeight: 500,
                color: 'var(--color-fd-muted-foreground)',
              }}
            >
              ESC
            </kbd>
          </div>

          {/* ---- Two-column content ---- */}
          <div style={{ display: 'flex', height: 400 }}>
            {/* Left column: results list */}
            <div
              ref={listRef}
              style={{
                flex: 1,
                overflowY: 'auto',
                borderRight: '1px solid var(--color-fd-border)',
                padding: 8,
              }}
            >
              {isDefault ? (
                groups.length === 0 ? (
                  <LoadingPlaceholder />
                ) : (
                  groups.map((group) => (
                    <div key={group.category} style={{ marginBottom: 8 }}>
                      <div
                        style={{
                          padding: '6px 8px',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          color: 'var(--color-fd-muted-foreground)',
                        }}
                      >
                        {group.category}
                      </div>
                      {group.pages.map((page) => {
                        const idx = flatItems.findIndex(
                          (f) => f.url === page.url,
                        );
                        return (
                          <SearchItem
                            key={page.url}
                            title={page.title}
                            selected={idx === selectedIndex}
                            onHover={() => setSelectedIndex(idx)}
                            onClick={() => navigate(page.url)}
                          />
                        );
                      })}
                    </div>
                  ))
                )
              ) : flatItems.length === 0 ? (
                <EmptyState loading={loading} />
              ) : (
                flatItems.map((item, i) => (
                  <SearchItem
                    key={item.url}
                    title={item.title}
                    selected={i === selectedIndex}
                    onHover={() => setSelectedIndex(i)}
                    onClick={() => navigate(item.url)}
                  />
                ))
              )}
            </div>

            {/* Right column: preview panel */}
            <div
              style={{
                width: 280,
                padding: 20,
                overflowY: 'auto',
                background: 'var(--color-fd-background)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {selectedItem ? (
                <>
                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      marginBottom: 12,
                      lineHeight: 1.4,
                      color: 'var(--color-fd-primary)',
                    }}
                  >
                    {selectedItem.title}
                  </h3>
                  {previewText ? (
                    <p
                      style={{
                        fontSize: '0.8125rem',
                        lineHeight: 1.65,
                        color: 'var(--color-fd-muted-foreground)',
                      }}
                    >
                      {previewText}
                    </p>
                  ) : (
                    <p
                      style={{
                        fontSize: '0.8125rem',
                        color: 'var(--color-fd-muted-foreground)',
                        opacity: 0.5,
                      }}
                    >
                      No description available.
                    </p>
                  )}
                </>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    fontSize: '0.8125rem',
                    color: 'var(--color-fd-muted-foreground)',
                  }}
                >
                  Select a page to preview
                </div>
              )}
            </div>
          </div>

          {/* ---- Footer ---- */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 16px',
              borderTop: '1px solid var(--color-fd-border)',
            }}
          >
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 500,
                color: 'var(--color-fd-muted-foreground)',
              }}
            >
              Affitor
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontSize: 10,
                color: 'var(--color-fd-muted-foreground)',
              }}
            >
              <span>↑↓ Navigate</span>
              <span>↵ Open</span>
              <span>⌘K Search</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(dialog, document.body);
}

/* -------------------------------------------------- */
/*  Sub-components                                    */
/* -------------------------------------------------- */

function SearchItem({
  title,
  selected,
  onHover,
  onClick,
}: {
  title: string;
  selected: boolean;
  onHover: () => void;
  onClick: () => void;
}) {
  return (
    <button
      data-search-item
      data-selected={selected}
      onMouseEnter={onHover}
      onClick={onClick}
      style={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        gap: 10,
        padding: '8px 8px',
        borderRadius: 6,
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        fontSize: '0.835rem',
        transition: 'background 150ms ease, color 150ms ease',
        background: selected ? 'var(--color-fd-accent)' : 'transparent',
        color: selected
          ? 'var(--color-fd-primary)'
          : 'var(--color-fd-muted-foreground)',
      }}
    >
      <FileText
        size={15}
        style={{ flexShrink: 0, opacity: 0.4 }}
      />
      <span
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {title}
      </span>
    </button>
  );
}

function EmptyState({ loading }: { loading: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        fontSize: '0.835rem',
        color: 'var(--color-fd-muted-foreground)',
      }}
    >
      {loading ? 'Searching...' : 'No results found'}
    </div>
  );
}

function LoadingPlaceholder() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        fontSize: '0.835rem',
        color: 'var(--color-fd-muted-foreground)',
      }}
    >
      Loading pages...
    </div>
  );
}
