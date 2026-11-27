# AdSense activation and placement plan

Ads are intentionally disabled by default and never requested in development. Configure actual publisher and slot IDs in the deployment environment; no fake IDs or secrets are needed. Copy .env.example to .env.local for local configuration, or use the hosting dashboard. Public variables are inlined at build time: rebuild/redeploy after edits.

## Verify and activate
1. Enter your real ca-pub publisher ID while leaving ads disabled. The layout adds the google-adsense-account verification tag and /ads.txt generates the direct seller line even before live ads are enabled. For a subdomain, also check the root domain's ads.txt and the site requirements in AdSense.
2. Add/verify the eligible site in AdSense and wait for approval. Create three responsive display units (banner, desktop sidebar and browse/footer) and one native In-article unit. Copy their numeric data-ad-slot values into the matching env variables. Missing slots render nothing.
3. Configure and publish the applicable consent messages through a Google-certified CMP (including EEA, UK and Switzerland requirements). The CONSENT_READY variable is a deployment attestation, not a consent implementation. Do not set it true until the actual configuration is in place. Review the privacy policy against actual data processing.
4. Keep Auto ads OFF initially in the AdSense dashboard. Do not enable vignette, anchor or overlay ads. Manual placements do not control account-level Auto ads; enabling those could inject ads into interactive routes. Only consider a carefully measured experiment after exclusions and policy checks.
5. Set NEXT_PUBLIC_ADS_ENABLED and NEXT_PUBLIC_ADSENSE_CONSENT_READY to true, deploy production, verify ownership, seller entry and live placements. Never click your own ads.

## Manual placement budget
- Home: one responsive display banner after popular visualizers and one responsive display unit after editorial FAQ content.
- Visualizer, game, topic, pattern, problem and cheat-sheet browsing indexes: one responsive display placement after the list (not mixed with question or game cards).
- Individual topic and pattern lessons: one in-article placement between content sections and an optional separate desktop-only display rail (1440px+). Cheat-sheet lessons use a display unit after the sheet instead of an in-article unit. Mobile receives only one unit.
- Interview and college preparation: one in-article placement between preparation sections (when there are multiple sections).
- No ad units on individual game, visualizer or problem execution pages, progress, revision, settings, daily challenges, roadmap, or legal/contact pages.
- No automatic refresh, artificial clicks, gated content, sticky units or app interstitials. Each configured slot requests once when near the viewport with a measurable width. Ads are separately labelled Advertisement and hidden completely when disabled.

Google decides actual inventory, size, fill and eligibility. The number of placements is not a guarantee of approval, revenue or policy compliance. Inspect actual devices, ad performance, viewability, layout shift and accidental-click risk before scaling. In-article slots must use an actual In-article unit; do not put a display slot ID in that field.

Official guidance: [Ad placement](https://support.google.com/adsense/answer/1346295) · [Gameplay ads](https://support.google.com/adsense/answer/2768340) · [In-article units](https://support.google.com/adsense/answer/9274522) · [Consent](https://support.google.com/adsense/answer/13554116) · [Site verification](https://support.google.com/adsense/answer/7584263) · [ads.txt](https://support.google.com/adsense/answer/12171244).
