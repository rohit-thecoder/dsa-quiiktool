# SEO launch checklist

The canonical production origin defaults to https://dsa.quiiktool.com. Change NEXT_PUBLIC_SITE_URL before deploying on a different domain. Set GOOGLE_SITE_VERIFICATION to the Search Console HTML-tag token if that is the chosen verification method.

## Implemented
- Descriptive titles, per-question metadata, canonical tags, social preview metadata and site language.
- A deduplicated XML sitemap at /sitemap.xml; original /problem/ pages remain available but nominate their matching /visualizers/ page as canonical.
- Private progress, settings and revision routes use noindex and are excluded from the sitemap. Crawlers can read their noindex directives.
- Structured breadcrumbs and learning-resource descriptions for educational pages. Structured data does not guarantee a Google rich result.
- Server-rendered worked inputs, real execution-step labels, outputs, readable reference code and related-question links. No claim that these pages accept arbitrary user input.
- Responsive ads disabled by default; ads are excluded from execution and personal routes.

## After deploying
1. Verify the site in Google Search Console using the correct origin; submit /sitemap.xml.
2. Inspect representative visualizer, game, topic and cheat-sheet URLs and confirm 200 responses, canonical tags and indexability. Verify the HTML metadata and links; test /robots.txt and /ads.txt.
3. Check mobile and desktop PageSpeed Insights and Lighthouse; monitor LCP, INP and CLS with real field data. No score is asserted before testing.
4. Review the originality, usefulness, correctness and instructional depth of all worked examples. Improve explanations where learners struggle. Avoid keyword stuffing, mass-generated thin pages, fake reviews or misleading claims.
5. Monitor indexing, clicks, impressions and queries in Search Console. Canonical preferences and sitemap submission do not guarantee crawling, indexing or rankings.

References: [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [Search Essentials](https://developers.google.com/search/docs/essentials), [Canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [Sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview).
