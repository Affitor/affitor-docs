import { existsSync } from 'node:fs';
import { join } from 'node:path';

/** "/a/shot.png" + "dark" -> "/a/shot-dark.png" */
function variant(src: string, suffix: string) {
  const dot = src.lastIndexOf('.');
  return `${src.slice(0, dot)}-${suffix}${src.slice(dot)}`;
}

const inPublic = (path: string) => existsSync(join(process.cwd(), 'public', path));
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
            {inPublic(variant(src, `phone-${theme}`)) ? (
              <source media="(max-width: 640px)" srcSet={variant(src, `phone-${theme}`)} />
            ) : null}
            {/* eslint-disable-next-line @next/next/no-img-element -- themed pair; next/image cannot swap by class */}
            <img src={variant(src, theme)} alt={alt} loading="lazy" decoding="async" />
          </picture>
        ),
      )}
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
