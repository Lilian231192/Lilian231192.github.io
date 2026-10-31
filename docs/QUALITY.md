# Release-candidate quality evidence

This report records verification of Constructa 1.0.0's local release candidate
on **2026-11-01**. It is not a claim that a public deployment, theme-directory
submission, or GitHub-hosted workflow has completed.

**Current checkpoint:** both final local production builds cover the floating
navigation dock, body-level cursor, and touch-globe refinements. Root and
repository-subpath runs each passed with 93 cases, 11 expected platform skips,
and no failures. Screenshots were refreshed. Linux-hosted execution and public
deployment remain separate gates.

## Environment

| Item | Verified environment |
| --- | --- |
| Runtime | Node.js 24.22.1 on Windows; Node 24 LTS is the documented line. |
| Package manager | pnpm 12.16.1 with package integrity pinned. |
| Framework | Astro 7.4.4, static output. |
| TypeScript | 6.0.3, matching the current Astro checker's supported peer range. |
| Unit runner | Vitest 5.0.5. |
| Browser runner | Playwright 1.64.1, Chromium desktop and mobile-emulated projects. |
| Content | Neutral demo configuration and original SVG artwork. |

## Completed local gates

| Gate | Result | Evidence scope |
| --- | --- | --- |
| `pnpm run ci` | Passed | Schema freshness, configuration, lint, types, Knip, and unit tests. |
| Unit tests | 75 passed, 0 failed | Current theme data, configuration, and utility tests. |
| Type diagnostics | 0 errors, 0 warnings | Astro check reported 94 files. |
| `pnpm build` | Passed | Current static theme build, not the predecessor portfolio. |
| Schema generation | Passed | `cv.schema.json` contains 277 UI-copy keys and matches the runtime schema. |
| Production dependency audit | 0 advisories | Current locked production graph. |
| Full dependency audit | 0 advisories | Current locked graph including development tools. |
| Clean frozen installation | Passed | Fresh directory, `pnpm install --frozen-lockfile --ignore-scripts`; no lockfile rewrite or peer warnings. |
| Repository-subpath browser suite | 93 passed, 11 expected skips, 0 failed | 104 cases in 2.6 minutes, including final dock/cursor/touch changes. |
| Root-path browser suite | 93 passed, 11 expected skips, 0 failed | A separate 104-case production run in 2.6 minutes. |
| Configuration fixtures | 3 production builds and 8 browser checks passed | Minimal/disabled/reordered content and wide-heading/print edge cases. |

The clean-install check was isolated from the working checkout. It validates
lockfile reproducibility with lifecycle scripts disabled; the normal CI install
still needs to run with the declared `allowBuilds` policy on its own runner.

Audit counts are a snapshot, not a guarantee of permanent security. Dependencies
retain their own upstream licenses and advisories. Exact reviewed overrides and
release-age exceptions are documented in [TOOLCHAIN.md](TOOLCHAIN.md).

## Browser and visual verification

The final repository-subpath **104-case** production-browser run completed with
**93 passed, 11 expected desktop/mobile skips, and 0 failures** in 2.6 minutes.
It exercised the immutable Astro production build at
`http://127.0.0.1:4326/astro-constructivist/`, with
`BASE_PATH=/astro-constructivist/`.

A separately built root-path site at `http://127.0.0.1:4327/`, using
`BASE_PATH=/` and `SITE_URL=https://example.com`, also completed **104 cases:
93 passed, 11 expected skips, 0 failures**, in 2.6 minutes. Together, the local
matrix contains 208 cases: 186 executed passes and 22 expected platform skips.

Primary projects used a 1440 x 900 desktop viewport and Pixel 7 emulation at
390 x 844. The responsive sweep covered 320 x 844, 390 x 844, 768 x 1024,
1024 x 768, 1280 x 720, and 1440 x 900. All four font families loaded, and
the checks found no missing assets. The run included Axe checks for the full
page, sections, and reduced-motion state, plus an actual one-page A4 PDF.

The exercised flows include:

- Desktop and mobile layouts, short viewports, and horizontal work fallback.
- Section and project anchors, history, keyboard focus, and command search.
- Project cases, lightbox, gallery modes, filters, and clipboard fallback.
- Live reduced-motion changes and blocked-storage behavior.
- Complete compact printing and a real one-page A4 PDF.
- Base-aware production assets, metadata, fonts, and public endpoints.
- Floating-dock indicator updates, cursor paint order, and underlying pointer targets.
- Real touch gestures: horizontal globe rotation and preserved native vertical panning.

`docs/images/desktop.png` (1440 x 900), `docs/images/mobile.png` (390 x 844), and
`docs/images/navigation.png` (1440 x 1080) were refreshed from the final validated
floating-dock build and visually inspected. The globe was paused with its real
control, all four fonts had loaded, and no page or asset errors were recorded.
The mobile image includes the call to action, metrics, profiles, and scroll
control. The navigation image shows all seven Index rows at a genuine tall
viewport. Cover and social artwork are separate promotional graphics, not test
screenshots.

These completed runs validate real local production output at both root and
repository-subpath URLs. Linux GitHub-hosted execution remains a separate
workflow check after the public code push; it is not inferred from the Windows
results.

## Independent review and configuration fixtures

The final review followed the project's Antfu conventions: named catalogs,
explicit runtime boundaries, schema-backed configuration, ESLint formatting,
Knip, and checks before publication. It fixed four actionable interaction issues:

| Finding | Fix and verification |
| --- | --- |
| Hero action targeting a project fragment | Resolve the real project destination rather than dropping the CTA; verified with a custom configured target. |
| Very wide hero glyphs | Fit configured lines without clipping, including three wide lines and six metrics. |
| Touch globe blocks page gestures | Separate horizontal drag intent from vertical scrolling; actual touch input changes the canvas horizontally and preserves native vertical pan. |
| Cursor hidden under the top bar | Mount the cursor outside `main`'s stacking context as a body child; verify paint order and that underlying controls remain clickable. |

Three isolated production configurations passed eight browser checks. They cover
all enhancements disabled, the top section disabled, reordered chapters, custom
UI copy, a single project, an empty gallery, and long/wide three-line headings.
The six-metric configuration still produces one A4 poster page. These fixtures
are evidence for configurable behavior, not a promise that arbitrary content
will fit without inspection.

Toolchain review removed obsolete integrations and unsafe default hook behavior,
added deterministic schema-drift checking, and validated a clean frozen install.
Both audits reported zero advisories after reviewed dependency updates and
narrow security overrides. TypeScript remains on the supported 6.x line rather
than forcing an unsupported latest major into the Astro checker.

## Public status

The [public repository](https://github.com/MiraHikari/astro-constructivist) has
been created with template mode, description, and topics. At this report's
checkpoint, the release code has not been pushed and the
[demo URL](https://mirahikari.github.io/astro-constructivist/) has not been
verified as deployed. GitHub Pages execution and public metadata validation
remain release gates.

GitHub Pages is configured to build from Actions, and private vulnerability
reporting is enabled. Those settings confirm neither a successful workflow run
nor a deployed release.

## Explicit limits

- No Lighthouse score, performance ranking, or universal accessibility
  certification is claimed.
- Firefox and WebKit are not covered by the current Chromium-only suite.
- TypeScript 7 is intentionally not installed because the current Astro checker
  declares support for TypeScript 5/6, not 7. See the compatibility note in
  [TOOLCHAIN.md](TOOLCHAIN.md).
- Static hosting removes a deployed application-server surface, but build/dev
  tools and remote user assets still require normal security review.
- Astro theme-directory submission is separate from local QA and deployment;
  this report does not imply acceptance or endorsement.

Re-run the relevant gates after changing content, dependencies, or build
configuration. Use [RELEASE.md](RELEASE.md) to track what remains rather than
turning an unchecked item into marketing copy.
