# Toolchain and dependency policy

The theme uses static Astro with TypeScript, named pnpm catalogs, ESLint as the
formatter/linter, Knip, Vitest, and Playwright. It does not need a React runtime,
an icon-download integration, or a post-build compression plugin.

## Supported development environment

- Node.js 24 LTS, at least 24.16.0. Node 24.22.2 is the recommended LTS patch
  at this dependency review; CI selects the current Node 24 line.
- pnpm 12.16.1, pinned with package integrity in `packageManager`.
- Astro 7.4.4 and the current stable direct-dependency versions recorded in
  `pnpm-workspace.yaml` and `pnpm-lock.yaml`.

Do not select prereleases merely because a package's `latest` metadata happens
to point at one. Node's LTS line is chosen from the official Node release index,
not the npm `node` wrapper's highest tag.

## TypeScript compatibility exception

TypeScript remains on **6.0.3**, the latest compatible stable 6.x version.
The current `@astrojs/check` 0.9.12 declares support for TypeScript 5.x and 6.x,
not 7.x. Installing TypeScript 7.0.2 solely to make every version number higher
would create an unsupported peer combination. Revisit this pin when Astro's
checker officially supports the newer line, then run all diagnostics and tests.

## Package-manager configuration

- Versions use named `prod` and `dev` catalogs; do not scatter a second set of
  version ranges into `package.json`.
- `allowBuilds` explicitly permits native installation steps that the build
  uses. No blanket script approval is needed.
- CI installs with `--frozen-lockfile`; a lockfile mismatch is an error to fix,
  not a reason to bypass the check.
- The quality gate is `pnpm run ci`. pnpm also has a clean-install command with
  the same short name, so use the explicit `run` form in automation.
- `prepare` does not write Git configuration or automatically replace hooks.
  `pnpm hooks:install` is opt-in and leaves existing hooks untouched.
- The pre-commit command uses local tools and the quality gate; it does not
  reinstall packages or fetch a remote executable on every commit.

## Scoped security resolutions

Two lint-only transitive packages currently require scoped replacements because
their consumers still declare affected version lines:

| Consumer → package | Replacement | Rationale |
| --- | --- | --- |
| `micromark-extension-math` → `katex` | 0.19.1 | Fixes GHSA-238p-pmpm-9mq7. The consumer uses the public `renderToString` API, checked with an isolated render smoke test. |
| TypeScript-ESLint, ESLint, ESLint config arrays, and SonarJS → `minimatch` | 11.0.3 | Fixes GHSA-g3hv-75wg-m249. Consumers use the public `minimatch` function or `Minimatch` class, checked against representative paths and the full linter. |

These overrides do not force all packages onto an unrelated major. Keep them
narrow, rerun lint/tests, and remove them when upstream dependency ranges adopt
the patched versions. Do not suppress advisories without documenting relevance
and a reviewable reason.

The 24-hour dependency-release delay has three exact, reviewed exceptions for
the requested latest update: `knip@6.44.1`, `electron-to-chromium@1.5.472`, and
`node-releases@2.0.63`. The remaining packages stay subject to the release-age
and trust policies. Exact exclusions are pruned when no longer needed; do not
turn this into a wildcard allowance for unreviewed new releases.

## Audit and update procedure

```bash
pnpm audit --prod
pnpm audit
pnpm run schema:check
pnpm run ci
pnpm build
pnpm test:e2e
```

Audit output is time-dependent. A previous zero result is not proof that a later
release is clean. Record the actual date, dependency revision, findings, and
test results for a release; do not copy a predecessor project's passing status.

For version discovery, prefer `fast-npm-meta` to large registry downloads when
only a version is needed. Inspect engines and peers as well as version numbers.
Upgrade source code and schema generation together, then validate a clean
installation and both root/subpath production previews.
