---
title: "Agentic Vibe Coding in a Mature OSS Project: What Worked, What Didn't"
date: 2026-03-08
author: Sheng Wu
description: "What happens when you apply agentic AI coding to a mature open-source project with real users, real compatibility contracts, and real consequences? 77K lines changed in 5 weeks — here's what I learned."
tags:
- AI
- Agentic Coding
- Vibe Coding
- TDD
- Architecture
- Engineering Productivity
- Open Source
endTime: 2026-03-08T23:00:00Z
---

Most "vibe coding" stories start with a greenfield project. This one doesn't.

Apache SkyWalking is a 9-year-old observability platform with hundreds of production deployments, a complex DSL stack, and an external API surface that users have built dashboards, alerting rules, and automation scripts against. When I decided to replace the core scripting engine — purging the Groovy runtime from four DSL compilers — the constraint wasn't "can AI write the code?" It was: "can AI write the code without breaking anything for existing users?"

The answer turned out to be yes — **~77,000 lines changed across 10 major PRs in about 5 weeks** — but only because the AI was tightly guided by a human who understood the project's architecture, its compatibility contracts, and its users. This post is about the methodology: what worked, what didn't, and what mature open-source maintainers should know before handing their codebase to AI agents.

## The Project in Brief

The task was to replace SkyWalking's Groovy-based scripting engines (MAL, LAL, Hierarchy) with a unified ANTLR4 + Javassist bytecode compilation pipeline, matching the architecture already proven by the OAL compiler. The internal tech stack was completely overhauled; the external interface had to remain identical.

Beyond the compiler rewrites, the scope included a new queue infrastructure (threads dropped from 36 to 15), virtual thread support for JDK 25+, and E2E test modernization. By conventional estimates, this was 5-8 months of senior engineer work.

For the full technical details on the compiler architecture, see the [Groovy elimination discussion](https://github.com/apache/skywalking/discussions/13716).

## What is Agentic Vibe Coding?

"Vibe coding" — a term coined by Andrej Karpathy — describes a style of programming where you describe intent and let AI write the code. It's powerful for prototyping, but on its own, it's risky for production systems.

**Agentic vibe coding** takes this further: instead of a single AI autocomplete, you orchestrate multiple AI agents — each with different strengths — under your architectural direction, with automated tests as the safety net. In my workflow:

- **Claude Code (plan mode)**: Primary coding agent. Plan mode lets me review the approach before any code is generated. This is critical for architectural decisions — I steer the design, Claude handles the implementation.
- **Gemini**: Code review, concurrency analysis, and verification reports. Gemini reviewed every major PR for thread-safety, feature parity, and edge cases.
- **Codex**: Autonomous task execution for well-defined, bounded work items.

The key insight: **AI writes the code, but the architect owns the design.** Without deep domain knowledge of SkyWalking's internals, no AI could have planned these changes. Without AI, I couldn't have executed them in 5 weeks.

## How TDD Made AI Coding Safe

The reason I could move this fast without breaking things comes down to one principle: **never let AI code without a test harness.**

My workflow for each major change:

1. **Plan mode first**: Describe the goal to Claude, review the plan, iterate on architecture before any code is written.
2. **Write the test contract**: Define what "correct" means — for the compiler rewrites, this meant cross-version comparison tests that run every expression through both the old and new engines, asserting identical results across 1,290+ expressions.
3. **Let AI implement**: With the test contract in place, Claude can write thousands of lines of implementation code. If it's wrong, the tests catch it immediately.
4. **E2E as the final gate**: Every PR must pass the full E2E test suite — Docker-based integration tests that boot the entire server with real storage backends.
5. **AI code review**: Gemini reviewed each PR for concurrency issues, thread-safety, and feature parity — catching things that unit tests alone wouldn't find.

This is the opposite of "hope it works" vibe coding. The AI writes fast, the tests verify fast, and I steer the architecture. The feedback loop is tight enough that I can iterate on complex compiler code in minutes instead of days.

## Lessons Learned

**AI is a force multiplier, not a replacement.** Before any AI agent wrote a single line, a human had to define the replacement solution: *what* gets replaced, *how* it gets replaced, and — critically — *where the boundaries are*. Which APIs could break? The internal compilation pipeline was fair game for a complete overhaul. Which APIs must stay aligned? Every external-facing DSL syntax, every YAML configuration key, every metrics name and tag structure had to remain byte-for-byte identical — because hundreds of deployed dashboards, alerting rules, and user scripts depend on them. Drawing these boundaries required deep knowledge of the codebase and its users. AI executed the plan at extraordinary speed, but the plan itself — the scope, the invariants, the compatibility contract — had to come from a human who understood the blast radius of every change.

**Plan mode is non-negotiable for architectural work.** Letting AI jump straight to code on a compiler rewrite would be a disaster. Plan mode's strength is that it collects code context — scanning imports, tracing call chains, mapping class hierarchies — and uses that context to help me fill in implementation details I'd otherwise have to look up manually. But it can't tell you the design principles. That direction had to come from me, stated clearly upfront, so the AI's planning stayed on the right track instead of optimizing toward a locally reasonable but architecturally wrong solution.

**Know when to hit ESC.** Claude has a clear tendency to dive deep into solution code writing once it starts — and it won't stop on its own when it encounters something that conflicts with the original plan's concept. Instead of pausing to flag the conflict, it will push forward, improvising around the obstacle in ways that silently violate the design intent. I had to learn to watch for this: when Claude's output started drifting from the plan, I'd manually cancel the task (ESC), call it off, identify where the plan and reality diverged, adjust the plan, and restart. This interrupt-replan cycle was a regular part of the workflow, not an exception. The architect has to stay in the loop — not just at planning time, but during execution — because AI agents don't yet know when to stop and ask.

**Spec-driven testing is necessary but not sufficient — the logic workflow matters more.** It's tempting to think that if you define the input/output spec clearly enough, AI can fill in the implementation and tests will catch any mistakes. I tried this. It doesn't work for anything non-trivial. During the expression compiler rewrite, Claude would sometimes change code in unreasonable ways just to make the spec tests pass — the inputs went in, the expected outputs came out, and everything looked green. But the internal logic was wrong: inconsistent with the design patterns the rest of the codebase relied on, impossible to extend, or solving the specific test case through a hack rather than a general mechanism. A spec only checks *what* the code produces; it says nothing about *how* the code produces it. For a mature project, the "how" matters enormously — the solution needs to be consistent with the existing architecture, widely adoptable by contributors, and maintainable long-term. That's why I needed cross-version testing *and* human review of the implementation path, not just the results.

**Testing at two levels kept the rewrite honest.** Cross-version testing was part of my design plan from the start — I architected the dual-path comparison framework so that every production DSL expression runs through both the old and new engines, asserting identical results across 1,290+ expressions. This gave me confidence no human review could match, and it was a deliberate planning decision: I knew AI-generated compiler code needed a mechanical proof of behavioral equivalence, not just eyeball review. On top of that, E2E tests served as the project's existing infrastructure safety net — Docker-based integration tests that boot the entire server with real storage backends. Unit tests and cross-version tests verify logic in isolation; E2E tests verify the system actually works end-to-end. For infrastructure-level changes like queue replacement and thread model changes, E2E is the only gate that truly matters. Together, the two layers — designed-for-this-rewrite cross-version tests and pre-existing E2E infrastructure — caught different classes of bugs and made shipping with confidence possible.

**Multiple AIs have different strengths.** Claude excels at large-scale code generation with plan mode. Gemini is exceptional at logic review — it can mentally trace code branches with given input data, simulating execution without actually running the code. This is significant for reviewing AI-generated code: Gemini would walk through a generated compiler method step by step, flagging where a null check was missing or where a branch would produce wrong output for a specific edge case. Codex proved most valuable as a test reviewer and honesty checker. AI-generated code has a subtle failure mode: the coding agent can make wrong assumptions and then write tests that pass by setting expected values to match the wrong behavior — effectively bypassing the test safety net. Codex caught cases where Claude had set unreasonable expected values that happened to make tests green, masking logic errors that would have surfaced in production. Using all three as checks on each other was far more effective than relying on any single one.

**The Mythical Man-Month still applies — and so does the Mythical Token-Month.** Brooks taught us that a task requiring 12 person-months does not mean 12 people can finish it in one month. The same law applies to AI: you cannot simply throw more tokens, more agents, or more parallel sessions at a problem and expect it to converge faster. Communication costs, coordination overhead, requirements analysis, and conceptual integrity — these software engineering fundamentals do not disappear just because your workforce is artificial. Worse, when the direction is wrong — when there's a conceptual error in the design or an unreasonable architectural choice — AI will not recognize it. It will charge down the wrong path at extraordinary speed, burning tokens furiously while trapped in a vortex of self-justification: patching code to make failing tests pass, adjusting expected values to match wrong behavior, adding workarounds on top of workarounds — each iteration making the codebase look more "complete" while drifting further from correctness. AI vibe coding cannot break out of this spiral on its own. Only a human who understands the domain can recognize "this is fundamentally wrong, stop," discard the work, and redirect. Speed without direction is just expensive chaos.

## The Bigger Picture

The agentic vibe coding approach worked because it combined AI's speed with human architectural judgment and automated test discipline. It's not magic — it's engineering, accelerated.

Brooks also gave us "No Silver Bullet," and its core distinction matters more than ever: software complexity comes in two kinds. **Essential complexity** comes from the problem itself — the domain semantics, the behavioral contracts, the concurrency invariants. No tool can eliminate this; it must be understood, modeled, and reasoned about by someone who knows the domain. **Accidental complexity** comes from the tools and implementation — boilerplate code, manual refactoring across hundreds of files, the mechanical work of translating a design into compilable source. This is exactly where AI excels. What made this project work was recognizing which complexity was which: I owned the essential complexity (architecture, API boundaries, correctness invariants), and AI demolished the accidental complexity (generating 77K lines of implementation, scaffolding test harnesses, rewriting repetitive patterns across dozens of config files). Confuse the two — let AI make essential decisions, or waste human time on accidental work — and you get the worst of both worlds.

Qian Xuesen(Tsien Hsue-shen)'s *Engineering Cybernetics* offers another lens that proved surprisingly relevant. His core framework — **feedback**, **control**, **optimization** — describes how to keep complex systems running toward their target. AI vibe coding at full speed is like a hypersonic missile: extraordinarily fast, but without a guidance system it just creates a bigger crater in the wrong place. The feedback loop in my workflow was the test harness — cross-version tests and E2E tests providing continuous signal on whether the system was still on course. Control was the human architect deciding when to intervene: reviewing plans before execution, hitting ESC when the direction drifted, choosing which AI to trust for which task. Optimization was iterative: each interrupt-replan cycle refined the approach, each Gemini review tightened the logic, each Codex audit caught assumptions the coding agent had smuggled past the tests. Without all three — feedback to detect deviation, control to correct course, optimization to converge — the speed of AI coding would be not an advantage but a liability. The faster the missile, the more precise the guidance must be.

For more details or to share your own experience with agentic coding on production systems, feel free to reach me on [GitHub](https://github.com/wu-sheng).
