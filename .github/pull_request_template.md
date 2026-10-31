## Problem and change

Explain the user-visible problem, the fix, and why this belongs in the theme.
Link the related issue if there is one.

## Verification

List the checks actually run and their results. Note failures and untested cases.

- [ ] `pnpm run ci`
- [ ] `pnpm build`
- [ ] Relevant browser regression tests
- [ ] Desktop and mobile visual inspection, if applicable
- [ ] Keyboard, reduced-motion, and print behavior, if affected
- [ ] Root and repository-base deployment, if URLs or assets changed

## Screenshots

Include before/after evidence for visual changes. Omit this section otherwise.

## Configuration and compatibility

- [ ] Public fields, `cv.schema.json`, runtime validation, and docs stay aligned.
- [ ] No secrets, private demo data, or unlicensed assets are included.
- [ ] Existing content and fallback behavior are preserved.
