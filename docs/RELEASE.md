# Release checklist

Status checkpoint: **2026-11-01, Constructa 1.0.0 local release candidate**.
Checked items have evidence in [QUALITY.md](QUALITY.md). Final local root/subpath
aggregates and updated captures cover the dock/cursor/touch refinements. Linux
checks and public deployment remain pending until their actual results are recorded.

## Configuration and content

- [x] `cv.json`, `cv.schema.json`, and runtime validation agree.
- [x] Normal content/copy/navigation/SEO/feature settings have a `cv.json` configuration boundary.
- [x] Three isolated production configurations pass eight browser checks for optional, disabled, and reordered content.
- [x] The example content is neutral and contains no private contact data,
  misleading credentials, real personal filing numbers, or third-party photos.
- [x] Demo SVGs and promotional assets have clear provenance and licenses.
- [ ] Long headings, non-ASCII text, empty lists, local images, and remote images
  have been checked.

## Build and quality

- [x] An isolated frozen install with Node.js 24 LTS and pnpm 12.16.1 succeeds with lifecycle scripts disabled.
- [x] `pnpm run ci` succeeds, including 75 passing unit tests.
- [x] `pnpm build` succeeds with zero type errors or warnings.
- [x] Production and full dependency audits report zero advisories for the reviewed lockfile.
- [x] Final repository-subpath aggregate complete: 93 passed, 11 expected platform skips, 0 failures.
- [x] Separate root-path aggregate complete: 93 passed, 11 expected platform skips, 0 failures.
- [x] The final aggregate covers the floating dock, cursor layering, and touch-globe changes.
- [x] Root and repository-base local production previews load without missing assets.
- [x] The exercised production-browser flows report no uncaught application errors or stale debug overlays.
- [ ] No temporary dependency junction, local screenshots, browser traces, or
  machine-specific helper files are included in Git.

## Experience

- [ ] Desktop, mobile, short viewport, and long-content layouts are inspected.
- [x] Hero mixed typography and pixel globe pass their configuration, motion, and real-touch checks.
- [x] Local project navigation, history, deep links, and keyboard focus work in the tested build.
- [x] Command search, cases, lightbox, gallery controls, and filters pass their browser checks.
- [x] Reduced-motion changes while the page is open tear down animation safely.
- [x] No-JS visitors can read the content and follow useful links.
- [x] Clipboard denial and storage restrictions leave useful fallbacks.
- [x] Compact print includes all skills and expanded records.
- [x] Poster mode produces one real, zero-margin A4 PDF page and returns cleanly.
- [ ] SVG/PNG poster exports include actual content and usable image/font assets.

## Public repository

- [x] Public repository name, description, and topics are set.
- [x] GitHub template mode is enabled.
- [x] Private vulnerability reporting is enabled.
- [ ] License and release source are present on the public default branch.
- [ ] README and Chinese README links point to real, accessible destinations.
- [x] `docs/images/cover.svg`, `desktop.png`, `mobile.png`, and `social-card.png`
  exist for the reviewed theme.
- [x] Desktop, mobile, and full Index screenshots are refreshed for the final navigation design.
- [x] Contribution, security, issue, and pull-request guidance is prepared.
- [x] Original license notices and third-party terms are preserved locally.
- [x] No React Bits component or exported template asset is redistributed.

## Deployment and publication

- [x] GitHub Pages is configured to deploy from GitHub Actions.
- [ ] Workflow permissions and the `github-pages` environment are ready.
- [ ] The public demo deployment succeeds at the documented URL.
- [ ] Canonical, robots, sitemap, social image, favicon, and base-path requests
  have been inspected on the deployed site, not just locally.
- [x] Package version and dated changelog describe the 1.0.0 release candidate.
- [x] Publication is explicitly authorized by the maintainer.
- [ ] The release commit/tag and public release notes are published.
- [ ] Theme-directory submission is separately reviewed and authorized.

Do not mark a gate complete because an earlier version or the original personal
portfolio passed. Report known gaps instead of silently converting them into
promises in marketing copy.
