# Vercel setup
Import the GitHub repository into a Vercel project and select the Next.js preset and repository root. Use the checked-in lockfile for installation. Run npm run build. Leave ads disabled for the first deployment. Launch only when authorized.

Add dsa.quiiktool.com in Project Settings → Domains. At the authoritative DNS provider add the CNAME named dsa with the exact target displayed for this project. Add a verification TXT record only if Vercel supplies one. Verify domain status and HTTPS before redirecting traffic. [Vercel domain guide](https://vercel.com/docs/domains/set-up-custom-domain)
