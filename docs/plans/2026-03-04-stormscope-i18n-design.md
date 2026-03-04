# StormScope i18n Design

## Overview
Add internationalization using i18next + react-i18next with Chinese as default and English as fallback. Provide a Header language switcher, translate all user-facing text, and tie geocoding language to the current i18n language. Persist language preference across sessions.

## Architecture & i18n Setup
- Initialize i18next in `src/i18n/index.ts`.
- Default language: `zh`. Fallback: `en`.
- Use `i18next-browser-languagedetector` to persist language (localStorage) and restore on load.
- Load translations from `src/i18n/locales/zh.json` and `src/i18n/locales/en.json`.
- Import i18n initialization in `main.tsx` before React renders.

## UI Integration & Language Switcher
- Add language switcher in Header next to theme toggle (compact “中/EN” toggle by default).
- Replace hard-coded strings in specified components/pages with `useTranslation()` and `t()`.
- Convert WMO weather descriptions and unit labels to translation keys.

## Data Flow & Services
- Use `i18n.language` for geocoding `language` parameter.
- Use i18next API to switch language (updates persistence through detector).
- No changes to layout, styling, or theme store.

## Testing & Verification
- Run `lsp_diagnostics` on changed files.
- Run `pnpm build` after changes.
- Ensure translations cover all visible text (header, sidebar, pages, weather cards, units, WMO descriptions).

## Risks
- Missing string coverage in non-specified components; mitigated by comprehensive scan and translation coverage.

