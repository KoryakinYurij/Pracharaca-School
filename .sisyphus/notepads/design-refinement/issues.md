
## Playwright Installation
- **Issue**: `npx playwright install chrome` failed/timed out in the environment.
- **Impact**: Unable to generate visual verification screenshots automatically.
- **Mitigation**: Relied on code review and build verification (`tsc` + `vite build`) which passed.

## System Dependencies
- **Date**: 2026-02-12
- **Issue**: Missing system dependencies for browser engines (libgstcodecparsers, libwebpmux, etc).
- **Details**: `npx playwright install-deps` requires sudo access which is not available.
- **Impact**: Cannot run Playwright tests even after installing browsers via npx playwright install.
