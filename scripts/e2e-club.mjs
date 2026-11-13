/**
 * Headless interaction test for the static web export.
 *
 * Usage:
 *   npm run test:e2e
 *
 * Runs `expo export --platform web` (via the npm script), serves dist/ locally,
 * then drives headless Chrome through the core flow with puppeteer-core:
 *   home -> quest board -> Volleyball detail -> type destination -> Vamanos! -> confirmation
 * Asserting each screen renders its expected content. Exits non-zero on failure.
 */
import http from "node:http";
import { mkdir, readFile } from "node:fs/promises";
import { join, extname } from "node:path";
import puppeteer from "puppeteer-core";

const root = new URL("../dist", import.meta.url).pathname;
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".ttf": "font/ttf",
  ".ico": "image/x-icon",
  ".json": "application/json",
};

const server = http.createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  let file = join(root, p);
  try {
    await readFile(file);
  } catch {
    if (!extname(p)) file = join(root, p + ".html");
  }
  try {
    const data = await readFile(file);
    res.writeHead(200, {
      "content-type": types[extname(file)] || "application/octet-stream",
    });
    res.end(data);
  } catch {
    const data = await readFile(join(root, "+not-found.html"));
    res.writeHead(404, { "content-type": "text/html" });
    res.end(data);
  }
});
await new Promise((r) => server.listen(8411, r));

const screenshots = new URL("../test-results/", import.meta.url).pathname;
await mkdir(screenshots, { recursive: true });

const chrome = process.env.CHROME_PATH || "/usr/bin/google-chrome";
const browser = await puppeteer.launch({
  executablePath: chrome,
  args: ["--no-sandbox"],
});

import assert from "node:assert/strict";
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const open = async (path = "/club") => {
    await page.goto("http://localhost:8411" + path, {
      waitUntil: "networkidle0",
    });
    await page
      .waitForFunction(
        () =>
          document.body.innerText.toLowerCase().includes("no jobs required."),
        { timeout: 8000 },
      )
      .catch(async (e) => {
        console.log(await page.evaluate(() => document.body.innerText));
        console.log(errors);
        await page.screenshot({
          path: join(screenshots, "club-debug.png"),
          fullPage: true,
        });
        throw e;
      });
  };
  const click = async (label) => {
    await page.evaluate((l) => {
      const e = [...document.querySelectorAll('[role="button"]')].find(
        (e) => e.getAttribute("aria-label") === l || e.textContent.trim() === l,
      );
      if (!e) throw Error("No button " + l);
      e.click();
    }, label);
  };
  const has = async (text) => {
    await page.waitForFunction(
      (t) => document.body.innerText.toLowerCase().includes(t.toLowerCase()),
      {},
      text,
    );
  };
  const missing = async (text) =>
    assert(
      !(await page.evaluate(() => document.body.innerText))
        .toLowerCase()
        .includes(text.toLowerCase()),
      text + " should be absent",
    );
  const field = async (label, value) => {
    const sel =
      'input[aria-label="' + label + '"],textarea[aria-label="' + label + '"]';
    await page.click(sel);
    await page.keyboard.down("Control");
    await page.keyboard.press("KeyA");
    await page.keyboard.up("Control");
    await page.type(sel, value);
  };
  const shot = async (name) => {
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      "horizontal overflow",
    );
    await page.screenshot({ path: join(screenshots, name), fullPage: true });
  };
  await page.goto("http://localhost:8411/", { waitUntil: "networkidle0" });
  await click("Find side-quest people");
  await has("Strangers, then");
  await open();
  await page.evaluate(() => localStorage.clear());
  await open();
  await has("Fictional demo host");
  await has("4 plans");
  await shot("club-discover-mobile.png");
  await page.evaluate(() => {
    const e = [...document.querySelectorAll("div")].find(
      (e) =>
        getComputedStyle(e).overflowY === "auto" &&
        e.scrollHeight > e.clientHeight + 100,
    );
    if (e) e.scrollTop = 900;
  });
  await shot("club-people-mobile.png");
  await click("Filter place North courts");
  await has("1 plan");
  await missing("Make a tiny terrible zine");
  await click("All places");
  await click("Make");
  await has("1 plan");
  await has("Make a tiny terrible zine");
  await click("All");
  await click("Open One more round?");
  await has("Full in this sample");
  const disabled = await page.evaluate(() =>
    [...document.querySelectorAll('[role="button"]')]
      .find((e) => e.textContent.includes("Full in this sample"))
      ?.getAttribute("aria-disabled"),
  );
  assert.equal(disabled, "true");
  await click("← Back to board");
  await click("Open Bad at badminton club");
  await has("2 of 4 spots");
  await click("Join on this device");
  await has("Local RSVP saved.");
  await has("3 of 4 spots");
  await shot("club-detail-mobile.png");
  await open();
  await click("My plans");
  await has("Bad at badminton club");
  await has("1 plan");
  await click("Open Bad at badminton club");
  await click("Leave local plan");
  await has("Local RSVP removed.");
  await has("2 of 4 spots");
  await click("← Back to board");
  await has("No matching local plans.");
  await click("Host a quest");
  await click("Save local hosted quest");
  await has("Give the quest a title");
  await field("Quest title", "Sketch walk");
  await field("When to meet (local note)", "Saturday, 4pm (draft)");
  await field(
    "What should newcomers know?",
    "Bring a pencil. Beginners welcome.",
  );
  await field("Total spots, including you (2-12)", "1");
  await click("Save local hosted quest");
  await has("Choose 2 to 12");
  await field("Total spots, including you (2-12)", "4");
  await shot("club-create-mobile.png");
  await click("Save local hosted quest");
  await has("Hosted quest saved");
  await has("Your local hosted quest");
  await has("Sketch walk");
  await open();
  await click("My plans");
  await has("Sketch walk");
  await click("Open Sketch walk");
  await has("1 of 4 spots");
  await shot("club-hosted-mobile.png");
  await click("Delete local hosted quest");
  await has("Local hosted quest deleted.");
  await has("No matching local plans.");
  // Failed writes must not claim success or erase the draft.
  await click("Host a quest");
  await field("Quest title", "Storage failure");
  await field("When to meet (local note)", "Local draft");
  await field("What should newcomers know?", "A test plan.");
  await page.evaluate(() => {
    Storage.prototype.setItem = function () {
      throw new Error("test blocked storage");
    };
  });
  await click("Save local hosted quest");
  await has("Could not save on this device.");
  await missing("Hosted quest saved");
  await has("Save local hosted quest");
  await open();
  assert.deepEqual(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("jobless.club.v1")).hosted,
    ),
    [],
  );
  // Corrupt persisted state must remain untouched and surface a retry state.
  await page.evaluate(() => localStorage.setItem("jobless.club.v1", "{bad"));
  await open();
  await has("Could not read local club data.");
  assert.equal(
    await page.evaluate(() => localStorage.getItem("jobless.club.v1")),
    "{bad",
  );
  await shot("club-storage-error.png");
  await page.evaluate(() => localStorage.removeItem("jobless.club.v1"));
  await click("Retry loading");
  await has("Fictional demo host");
  await page.setViewport({ width: 1280, height: 1000 });
  await shot("club-discover-desktop.png");
  await page.emulateMediaFeatures([
    { name: "prefers-color-scheme", value: "dark" },
  ]);
  await open();
  await shot("club-discover-dark.png");
  assert.deepEqual(errors, []);
  console.log(
    "e2e-club: discovery, filters, full state, local join/leave/reload, create/validation/delete, failed writes, corrupt storage, mobile/desktop/dark passed",
  );
} finally {
  await browser.close();
  server.close();
}
