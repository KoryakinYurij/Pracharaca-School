# Baseline Audit Issues
- Playwright MCP server failed due to missing `chrome` binary and lack of sudo permissions to install it.
- ESM import for `playwright` in `.js` files failed with global `NODE_PATH`; switched to `.cjs` and `require`.
- Large JS bundle detected (1.2 MB), exceeding the 500 kB warning limit.
