# F3 Real QA Replay Results

Generated: 2026-02-24T11:28:14.714Z
Scenarios: 9/9
Integration: PASS
VERDICT: PASS

## Verification Commands

| Command | Status | Evidence |
| --- | --- | --- |
| npm run test | PASS | f3-test.log |
| npm run build | PASS | f3-build.log |

## Scenario Replay

| ID | Title | Category | Intent | Status | Evidence |
| --- | --- | --- | --- | --- | --- |
| f3-s1-main-topics-back-cta | Main topics flow and topic back CTA | integration | happy | PASS | f3-dev-main-topics-back-flow.png |
| f3-s2-invalid-topic-recovery | Unknown topic slug shows recovery navigation | negative | error-path | PASS | f3-dev-topic-invalid-recovery.png |
| f3-s3-lesson-noble-basics-expanded | Lesson noble-basics expands cards with visible content | integration | happy | PASS | f3-dev-lesson-noble-basics-expanded.png |
| f3-s4-lesson-qa-craft-expanded | Lesson qa-craft expands cards with visible content | integration | happy | PASS | f3-dev-lesson-qa-craft-expanded.png |
| f3-s5-migrated-renderer-structures | Migrated renderer structures are visible in lesson cards | integration | happy | PASS | f3-dev-migrated-renderer-structures.png |
| f3-s6-fallback-renderer-visible-safe | Legacy fallback sections stay visible and non-empty | negative | fallback-safety | PASS | f3-dev-fallback-renderer-visible-safe.png |
| f3-s7-dev-kitchen-sink-entry | DEV kitchen-sink entry is visible and route is reachable | integration | happy | PASS | f3-dev-kitchen-sink-entry.png |
| f3-s8-prod-home-hides-dev-entry | Preview root hides DEV kitchen entry | negative | prod-guard | PASS | f3-prod-home-no-dev-entry.png |
| f3-s9-prod-kitchen-route-guarded | Preview direct /kitchen-sink is guarded at browser contract level | negative | prod-guard | PASS | f3-prod-kitchen-guard.png |
