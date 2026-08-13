/**
 * Resolves a path inside `public/` against Vite's configured base.
 *
 * Needed because this deploys to GitHub Pages under a subpath
 * (`/mb-barbershop-landing/`). Vite rewrites asset URLs it parses, but a plain
 * string like `'/img/hero.webp'` in JSX is invisible to it and would resolve
 * against the domain root and 404. `BASE_URL` always ends in a slash.
 */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
}
