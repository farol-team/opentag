// Renders the README mockups to PNG in ../ .
//
//   python3 build-tray.py                 # stamps the runner UI with a Tauri stub
//   node --experimental-default-type=module shoot.mjs
//
// playwright-core is a devDependency of app/, and its browser needs downloading
// once (from app/: node_modules/.bin/playwright-core install chromium --with-deps).
import { chromium } from "../../../app/node_modules/playwright-core/index.mjs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "..");

const SHOTS = [
  ["slack-running.html", "slack-thread.png", 1120],
  ["slack-done.html", "slack-thread-done.png", 1120],
  ["dashboard.html", "dashboard.png", 1200],
  ["activity.html", "activity.png", 1260],
  ["tray-frame.html", "runner-tray.png", 460],
];

const browser = await chromium.launch();
for (const [file, png, width] of SHOTS) {
  const page = await browser.newPage({
    viewport: { width, height: 900 },
    deviceScaleFactor: 2,
  });
  await page.goto("file://" + resolve(here, file));
  await page.waitForTimeout(400);
  // Clip a little wider than the window so its drop shadow survives.
  const b = await (await page.$(".window")).boundingBox();
  const pad = 22;
  await page.screenshot({
    path: resolve(out, png),
    omitBackground: true,
    clip: {
      x: b.x - pad, y: b.y - pad,
      width: b.width + pad * 2, height: b.height + pad * 2,
    },
  });
  console.log(png);
  await page.close();
}
await browser.close();
