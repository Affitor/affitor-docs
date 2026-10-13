import type { ReactNode } from 'react';
import { ARROW, Band } from './ui';

const BTN = 'inline-flex h-7 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 font-medium text-xs transition-all duration-150';

/** Light: the v5 blue-to-white gradient. Dark: blue into the card color, so the band ends on the page. */
const GRADIENT =
  'bg-[linear-gradient(to_bottom,oklch(37.9%_0.146_265.522)_0%,oklch(42.4%_0.199_265.638)_20%,var(--color-fd-primary)_50%,oklch(80.9%_0.105_251.813)_75%,oklch(93.2%_0.032_255.585)_88%,#fff_100%)] dark:bg-[linear-gradient(to_bottom,oklch(28.2%_0.091_267.935)_0%,oklch(37.9%_0.146_265.522)_35%,var(--color-fd-primary)_75%,var(--color-fd-card)_100%)]';

/**
 * Closing call to action. Children: a heading and a paragraph (kept in the .md twin); the two
 * buttons are fixed: docs and program creation, both absolute affitor.com URLs.
 */
export function Cta({ children, image = '/blog/shots/dashboard-live.png' }: { children: ReactNode; image?: string }) {
  return (
    <section>
      <Band>
        <div className="relative rounded-sm bg-white dark:bg-fd-card">
          <div className="p-1">
            <div className={`relative overflow-hidden rounded-sm p-8 ${GRADIENT}`}>
              <div className="relative flex flex-col items-center justify-between gap-8 lg:flex-row">
                <div className="text-white lg:flex-1 [&>h3]:mb-2 [&>h3]:font-semibold [&>h3]:text-xl [&>p]:max-w-lg [&>p]:text-sm [&>p]:text-white/80">
                  {children}
                  <div className="mt-4 flex flex-row gap-4">
                    <a className={`${BTN} bg-fd-secondary text-fd-secondary-foreground hover:bg-fd-secondary/80`} href="https://affitor.com/docs">
                      Read the docs
                    </a>
                    <a
                      className={`${BTN} border border-transparent bg-fd-background text-fd-foreground shadow-sm shadow-black/15 ring-1 ring-fd-foreground/10 hover:bg-fd-muted`}
                      href="https://affitor.com/welcome"
                    >
                      Create your program {ARROW}
                    </a>
                  </div>
                </div>
                <div className="relative mx-auto -mb-12 w-full translate-y-4 lg:mx-0 lg:-mr-10 lg:w-1/2 lg:translate-y-6 lg:perspective-[1000px] xl:w-3/5">
                  <div className="relative overflow-hidden rounded-lg shadow-xl lg:rounded-tl-sm lg:[transform:rotateX(4deg)_rotateY(-12deg)_rotateZ(1deg)]">
                    {/* eslint-disable-next-line @next/next/no-img-element -- plain img: next/image breaks the blog host checks */}
                    <img className="h-auto w-full" src={image} width={1600} height={1000} alt="Affitor dashboard" loading="lazy" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-white via-white/70 to-transparent dark:from-fd-card dark:via-fd-card/70" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Band>
    </section>
  );
}
