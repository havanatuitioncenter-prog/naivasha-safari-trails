<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

Business facts (base city, coverage, contacts, tour data) live in src/lib/site.ts and are read by every page, so a corrected fact changes in one place instead of drifting across routes.

Visitor submissions use shared Zod schemas and TanStack server functions; booking contact data is service-role-only, while consented visitor reviews are publicly readable. This keeps private requests separate from public stories.
Tour detail URLs use stable name-derived slugs and an unnested tours detail route so the tour catalogue does not swallow detail pages.
- The /admin area is a shared-password gate (ADMIN_PASSWORD env var, timing-safe compare, encrypted useSession cookie), not per-user auth; all admin data functions in src/lib/admin.functions.ts must call requireAdmin() before touching supabaseAdmin.
- After a migration adds columns, the Data API schema cache may be stale; if updates on new columns silently fail, run NOTIFY pgrst, 'reload schema'.
