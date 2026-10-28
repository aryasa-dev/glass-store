<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:custom-design-rules -->
## 🎨 Global Design System & Styling Rules

You must strictly follow the design tokens, layout behaviors, and UI component structures defined in the Refero design file. Before writing, modifying, or refactoring any frontend components, parse and apply the constraints from:
* **@[Design System Specifications](./DESIGN.md)**

### Enforcement Guidelines:
1. **Color Roles & Typography**: Do not hardcode random hex colors or font sizes. Always look up the allowed tokens in `./DESIGN.md`.
2. **Component Structure**: Match the structural layout, padding scales, and border-radii guidelines provided in the design markdown.
3. **Consistency**: If a generated element drifts from the styles mentioned in the reference file, self-correct and rewrite it to match.
<!-- END:custom-design-rules -->
