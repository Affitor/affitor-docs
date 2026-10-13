/**
 * Display name -> anchor id and logo file (`public/blog/logos/`). Prices, links and claims stay in
 * the post's markdown; this map just knows how to draw a tool. A name missing here fails the build.
 */
export const TOOLS: Record<string, { id: string; logo: string }> = {
  Affitor: { id: 'affitor', logo: 'affitor-icon-blue-on-white.svg' },
  PromoteKit: { id: 'promotekit', logo: 'promotekit-apple-touch-icon.png' },
  Endorsely: { id: 'endorsely', logo: 'endorsely-256.png' },
  'Impact.com': { id: 'impact', logo: 'impact.png' },
  Refersion: { id: 'refersion', logo: 'refersion.png' },
  Rewardful: { id: 'rewardful', logo: 'rewardful-icon-rw.png' },
  FirstPromoter: { id: 'firstpromoter', logo: 'firstpromoter-icon-192.avif' },
  Awin: { id: 'awin', logo: 'awin.svg' },
  Partnero: { id: 'partnero', logo: 'partnero-symbol.svg' },
  Tolt: { id: 'tolt', logo: 'tolt-256.png' },
  Tapfiliate: { id: 'tapfiliate', logo: 'tapfiliate.png' },
  'Post Affiliate Pro': { id: 'postaffiliatepro', logo: 'postaffiliatepro.svg' },
  'Dub Partners': { id: 'dub', logo: 'dub-logo.svg' },
  Reditus: { id: 'reditus', logo: 'reditus-icon-256.png' },
  PartnerStack: { id: 'partnerstack', logo: 'partnerstack-webclip.png' },
  Partnerize: { id: 'partnerize', logo: 'partnerize.png' },
  Everflow: { id: 'everflow', logo: 'everflow.svg' },
  'CJ Affiliate': { id: 'cj', logo: 'cj.svg' },
  'Rakuten Advertising': { id: 'rakuten', logo: 'rakuten.png' },
};

/** The tool we make: its row and column get the primary tint. */
export const OURS = 'Affitor';

export function tool(name: string) {
  const entry = TOOLS[name];
  if (!entry) throw new Error(`Unknown tool "${name}": add it to src/components/blog/comparison/tools.ts`);
  return { name, ...entry, ours: name === OURS };
}
