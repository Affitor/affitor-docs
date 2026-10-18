import { HOME_URL } from '@/config/site-nav';
import { PublicLink } from '@/components/public-link';

/**
 * The Affitor logo as affitor.com draws it (affiliate-dashboard src/components/ui/Logo.tsx):
 * the blue "Affitor" wordmark, with the app glyph in front when `full`. Links to the home page.
 */
export function Logo({ full = false }: { full?: boolean }) {
  return (
    <PublicLink href={HOME_URL} aria-label="Affitor home" className="inline-flex items-center gap-1.5 shrink-0">
      {full && (
        <svg width={24} height={24} viewBox="0 0 104 104" fill="none" aria-hidden="true">
          <rect width="104" height="104" rx="19.5" fill="white" />
          <path
            d="M31.8914 92H14L41.2613 13H62.7773L90 92H72.1086L52.3278 31.0527H51.7108L31.8914 92ZM30.7732 60.9478H73.034V73.9858H30.7732V60.9478Z"
            fill="#155DFC"
          />
        </svg>
      )}
      <span className="text-2xl font-bold text-[#155DFC] leading-none tracking-[-0.02em]">Affitor</span>
    </PublicLink>
  );
}
