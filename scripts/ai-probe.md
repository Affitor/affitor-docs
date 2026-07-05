# ai-probe — Monday manual AI-visibility probe

Weekly ritual (every Monday, ~20 min). Re-runs the 8 probes from
`.content-factory/AI-RANK-probes.md` with the same method as the originals and records
deltas. Spec: `.content-factory/AI-RANK-redesign.md` Part D3.

Baseline: the 2026-07-05 probes file (`.content-factory/AI-RANK-probes.md`).

## The 8 queries

Phrased as buyer prompts (same set Ahrefs Brand Radar tracks, D1):

1. "how to set up a Stripe affiliate program"
2. "Tolt vs Rewardful which is better"
3. "affiliate tracking software pricing comparison"
4. "best affiliate software for SaaS"
5. "best Rewardful alternatives"
6. "PartnerStack alternatives"
7. "how to start an affiliate program for my SaaS"
8. "Rewardful vs FirstPromoter"

## Method

For each query, run three variants — base, `+ 2026`, `+ reddit` — via WebSearch
(same method as the original probes). For each variant record:

- Top-10 URLs.
- Whether any `affitor.com` / `docs.affitor.com` URL appears, and at what rank.
- Which sentence the AI answer quotes verbatim, and from whom.
- Any new entrant vs last week.

## Where to record results

One file per run: `.content-factory/tracking/probe-YYYY-MM-DD.md`

Format — one table per query:

```markdown
## <query>

| variant | our rank | cited? | quoted sentence | top mover |
|---|---|---|---|---|
| base | — | no | "..." — vendor.com | new entrant X |
| 2026 | 7 | yes | "..." — docs.affitor.com | — |
| reddit | — | no | — | — |
```

Close the file with a 5-line summary:

1. Queries where we entered or moved.
2. Freshness of incumbents (who bumped `dateModified`).
3. The single highest-yield action for the coming week.
4. Any post crawled by bots but never cited → check it against rules A3/A5/A6
   (missing liftable block) in `.content-factory/AI-RANK-redesign.md`.
5. Any query where an incumbent bumped `dateModified` → schedule our A6 pricing
   refresh for that cluster.

## Weekly review loop (how this fits)

- Ahrefs Brand Radar share-of-voice (D1) = **outcome**
- PostHog crawler hits + AI-referral sessions (D2, `src/middleware.ts`) = **pipeline**
- This probe file (D3) = **diagnosis**
