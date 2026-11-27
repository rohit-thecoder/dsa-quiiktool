# QuiikTool DSA

Explore 388 organized DSA questions (51 original configurable execution problems, 334 worked-example simulations and additional game-backed labs), and play 14 games with 15 levels each. This Next.js application stores progress locally.

## Development

Use Node.js 22.12+ and Bun. Run `bun install` then `bun run dev`. The verified npm alternative is `npm ci` followed by `npm run dev`. Run `bun run lint`, `bun run typecheck`, `bun run test`, and `bun run build` before release. Install Chromium with `npx playwright install chromium` and run `bun run test:e2e`. Set PW_CHANNEL=chrome to use installed Chrome. Run `python tests/reference/verify.py` to check the multilingual listings with local compilers.

## Guides

[Architecture](docs/ARCHITECTURE.md) · [Product research](docs/PRODUCT_RESEARCH.md) · [Current coverage](docs/IMPLEMENTATION_STATUS.md) · [Algorithm validation](docs/ALGORITHM_VALIDATION.md) · [Vercel and domain setup](docs/DEPLOYMENT.md) · [AdSense activation](docs/ADSENSE.md) · [SEO launch checklist](docs/SEO.md)
