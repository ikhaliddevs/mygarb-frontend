# Component guidelines

- Use Bootstrap 5 grid/utilities/forms and the theme in `styles/`; no competing framework or Tailwind.
- Preserve Cormorant Garamond headings, DM Sans body, forest/ivory/champagne colors, rounded white cards, existing photo crops and spacing.
- Keep pages compositional. Put workflow state and validation in feature modules; generic UI receives typed props and callbacks.
- Use actual inputs for radios, checkboxes and toggles. Every field needs a persistent label, accessible error association and keyboard interaction.
- Dialog/offcanvas adapters must initialize and dispose individual Bootstrap plugins, synchronize events with React and restore focus. Do not let multiple mechanisms own the same DOM state.
- Import Bootstrap JavaScript only when its component is implemented. The current shells use visible responsive navigation and native forms; modal/dropdown/offcanvas adapters will be introduced when needed.
- Use IDs as list keys, avoid broad `any`, use `@/` imports, and do not fetch from components.
- Separate request, order, issue and approval states. A shared chip receives presentation tone/label; feature code owns lifecycle mappings.
- Every server-driven feature needs loading, empty, failure/retry and success states. Never present fixtures as actual records.
- Do not port `vp` preview props into production routing. Use responsive Bootstrap layouts and targeted SCSS. Test 360, 375, 390, 768, 1024 and 1440px.
- Keep actions at least 44px where practical, visible focus, safe-area clearance and usable mobile keyboards.
- Images need accurate alt text, preserved aspect ratios and failure handling. Keep original assets; only import the assets needed by a feature.
- Bundle fonts locally. Production must not load `support.js`, design canvases or runtime-evaluated templates.
