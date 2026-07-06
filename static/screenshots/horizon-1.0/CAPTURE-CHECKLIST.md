# Horizon UI 1.0 — AI Assistant post — screenshot capture checklist

Assets for `content/blog/2026-07-06-horizon-ui-ai-assistant/index.md`, referenced as
`/screenshots/horizon-1.0/<file>`. Capture against a **populated demo OAP with the AI
Assistant enabled** and a model configured. Dark theme, ~1440px-wide viewport, to match
the 0.7.0 series.

## Already in place (extracted from the screen recording)

- [x] `ai-00-investigation.mp4` + `ai-00-investigation-poster.webp` — the lead video (a 3x
      capture: "what's unhealthy?" → alarms → response-time / error-rate figures).
- [x] `ai-01-topology.webp` — the assistant drawing a service-dependency graph inline.
- [x] `ai-02-catalog-grounded.webp` — the assistant orienting with list_layers / list_services /
      catalog tool calls before rendering a figure.
- [x] `ai-03-summary.webp` — a bounded, honest "Summary of what's unhealthy" conclusion.

## Still to capture (the post has `<!-- FIGURE TO CAPTURE -->` markers at these spots)

- [ ] `ai-04-profiling-card.webp` — **the profiling decision card.**
  - **Reach:** run an investigation where metrics/traces can't localize the cause so the
    assistant calls `propose_profiling`; capture the decision card showing its proposed
    cause, the rationale ("why profiling"), what it expects to reveal, and the **Approve**
    control — *before* anything runs.
  - **Section:** "It proposes; you approve."

- [ ] `ai-05-enable.webp` — **the enable/config surface.**
  - **Reach:** the launcher's **read-only "ask your administrator to set it up" state** (what a
    user sees before the feature is enabled/configured), or the `ai:` config block itself.
  - **Section:** "Bring your own LLM." (Note: there is **no** "bring your own key" playground —
    credentials are server-side central config only.)

## Optional / nice-to-have

- [ ] A shot of the **starter chips** with the `<service>` fill-in open (type a partial name /
      description → resolved to a real service). Would slot into "Where it lives".
- [ ] The **drawer vs. full-page (`/ai`)** framing, if a side-by-side helps.
- [ ] The assistant reading **live Kubernetes pod logs** (the on-demand tail pane), for the
      root-cause section.

> Filenames are the contract — save the captures under these exact names and the post picks
> them up. Convert PNG captures to webp with `cwebp -q 84 in.png -o out.webp`.
