import { closeSync, existsSync, openSync, readSync } from 'node:fs';
import { join } from 'node:path';
import { getImageProps } from 'next/image';

/** "/a/shot.png" + "dark" -> "/a/shot-dark.png" */
function variant(src: string, suffix: string) {
  const dot = src.lastIndexOf('.');
  return `${src.slice(0, dot)}-${suffix}${src.slice(dot)}`;
}

const inPublic = (path: string) => existsSync(join(process.cwd(), 'public', path));

/** Width and height from the PNG header, so the page reserves the space before the image loads. */
function pngSize(path: string) {
  const head = Buffer.alloc(24);
  const fd = openSync(join(process.cwd(), 'public', path), 'r');
  try {
    readSync(fd, head, 0, 24, 0);
  } finally {
    closeSync(fd);
  }
  if (head.toString('ascii', 12, 16) !== 'IHDR') throw new Error(`<Media> images must be PNG: ${path}`);
  return { width: head.readUInt32BE(16), height: head.readUInt32BE(20) };
}

/**
 * Resized WebP through the image optimizer, sized to the 806 px column (.cl-media), so a phone
 * downloads a few hundred pixels, not the 2x capture.
 */
function optimized(src: string, alt: string, sizes: string) {
  return getImageProps({ src, alt, sizes, ...pngSize(src) }).props;
}
const COLUMN = '(max-width: 838px) calc(100vw - 32px), 806px';

/** The optional phone capture, used at 640 px and below. */
function PhoneSource({ src, alt }: { src: string; alt: string }) {
  if (!inPublic(src)) return null;
  const { srcSet, sizes, width, height } = optimized(src, alt, 'calc(100vw - 32px)');
  return <source media="(max-width: 640px)" srcSet={srcSet} sizes={sizes} width={width} height={height} />;
}

const THEMES = ['light', 'dark'] as const;

/**
 * <Media src="/docs/changelog/<slug>/shot.png" alt="..." /> in a changelog entry.
 * Picks shot-light / shot-dark with the site theme. A .mp4 plays as a silent loop with its
 * shot-<theme>.poster.png. An optional shot-phone-<theme>.png replaces the desktop shot at
 * 640 px and below. Entry pages are static, so the phone check runs at build time.
 */
export function Media({ src, alt, caption, todo }: { src?: string; alt?: string; caption?: string; todo?: string }) {
  if (todo) throw new Error(`Changelog media placeholder left in an entry: ${todo}`);
  if (!src?.startsWith('/')) throw new Error(`<Media> src must be a /docs/changelog/... path, got ${src}`);
  if (!alt) throw new Error(`<Media src="${src}"> needs alt text`);

  const video = src.endsWith('.mp4');
  return (
    <figure className="cl-media">
      {THEMES.map((theme) =>
        video ? (
          <video
            key={theme}
            className={`cl-${theme}`}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster={variant(src, theme).replace(/\.mp4$/, '.poster.png')}
            aria-label={alt}
          >
            <source src={variant(src, theme)} type="video/mp4" />
          </video>
        ) : (
          <picture key={theme} className={`cl-${theme}`}>
            <PhoneSource src={variant(src, `phone-${theme}`)} alt={alt} />
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- themed pair; next/image cannot swap by class (alt is in the props) */}
            <img {...optimized(variant(src, theme), alt, COLUMN)} />
          </picture>
        ),
      )}
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
