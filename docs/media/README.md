# docs/media — the pictures in the root README

`architecture.svg` is hand-written; edit it directly.

The PNGs are rendered from the HTML in [`mockups/`](mockups), so the screenshots can be
re-cut when the product copy changes instead of being re-photographed:

```bash
cd docs/media/mockups
python3 build-tray.py     # stamps the shipping runner UI with a Tauri stub
node shoot.mjs            # writes ../*.png
```

`shoot.mjs` drives Chromium through `playwright-core` from `app/node_modules`; the browser
downloads once with `node_modules/.bin/playwright-core install chromium --with-deps` run
from `app/`.

Two honest notes about what these are:

- `runner-tray.png` is the **real** tray UI (`runner/apps/desktop/ui/index.html`), with only
  Tauri's IPC stubbed out — the markup and CSS are the shipping ones.
- The Slack and dashboard shots are **mockups**: same copy, same components, same colours as
  the product, but hand-built HTML rather than a live capture. The root README says so where
  they appear. Keep it that way if you replace them.
