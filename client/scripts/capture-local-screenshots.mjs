import { chromium, firefox, webkit } from "playwright";

const TARGET_URL = process.env.TARGET_URL ?? "http://127.0.0.1:5173/";
const OUT_DIR = process.env.OUT_DIR ?? "artifacts";
const WAIT_UNTIL = process.env.WAIT_UNTIL ?? "networkidle";

function nowStamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return [
    d.getFullYear(),
    pad(d.getMonth() + 1),
    pad(d.getDate()),
    "-",
    pad(d.getHours()),
    pad(d.getMinutes()),
    pad(d.getSeconds()),
  ].join("");
}

const runId = process.env.RUN_ID ?? nowStamp();
const baseName = `local-${runId}`;

const artifacts = {
  targetUrl: TARGET_URL,
  finalUrl: null,
  screenshots: [],
  console: [],
  pageErrors: [],
  requestFailed: [],
  badResponses: [],
};

async function launchBrowser() {
  const attempts = [
    {
      name: "chromium (channel: chrome)",
      fn: () => chromium.launch({ channel: "chrome" }),
    },
    { name: "chromium", fn: () => chromium.launch() },
    { name: "webkit", fn: () => webkit.launch() },
    { name: "firefox", fn: () => firefox.launch() },
  ];

  /** @type {unknown[]} */
  const errors = [];
  for (const a of attempts) {
    try {
      const browser = await a.fn();
      return { browser, launched: a.name, errors };
    } catch (e) {
      errors.push({ attempt: a.name, error: e?.message ?? String(e) });
    }
  }
  const err = new Error("Failed to launch any Playwright browser.");
  // @ts-ignore - attach debug info for printing.
  err.launchErrors = errors;
  throw err;
}

const { browser, launched, errors: launchErrors } = await launchBrowser();
const page = await browser.newPage();

page.on("console", (msg) => {
  const type = msg.type();
  if (type === "error" || type === "warning") {
    artifacts.console.push({
      type,
      text: msg.text(),
      location: msg.location(),
    });
  }
});

page.on("pageerror", (err) => {
  artifacts.pageErrors.push({
    message: err?.message ?? String(err),
    stack: err?.stack,
  });
});

page.on("requestfailed", (req) => {
  artifacts.requestFailed.push({
    url: req.url(),
    method: req.method(),
    resourceType: req.resourceType(),
    failure: req.failure(),
  });
});

page.on("response", (res) => {
  const status = res.status();
  if (status >= 400) {
    artifacts.badResponses.push({
      url: res.url(),
      status,
      statusText: res.statusText(),
    });
  }
});

await page.goto(TARGET_URL, { waitUntil: WAIT_UNTIL, timeout: 60_000 });
artifacts.finalUrl = page.url();

const mainShot = `${OUT_DIR}/${baseName}-main.png`;
await page.screenshot({ path: mainShot, fullPage: true });
artifacts.screenshots.push(mainShot);

const looksLikeLogin =
  /\/login\b/i.test(artifacts.finalUrl ?? "") ||
  (await page
    .locator(
      "input[type='password'], form[action*='login'], [data-testid*='login'], text=/\\blog\\s*in\\b/i"
    )
    .first()
    .isVisible()
    .catch(() => false));

if (looksLikeLogin) {
  const loginShot = `${OUT_DIR}/${baseName}-login.png`;
  await page.screenshot({ path: loginShot, fullPage: true });
  artifacts.screenshots.push(loginShot);
}

await browser.close();

// Print a compact report for CI/terminal use.
const errCount =
  artifacts.console.filter((c) => c.type === "error").length +
  artifacts.pageErrors.length +
  artifacts.requestFailed.length +
  artifacts.badResponses.length;

process.stdout.write(
  JSON.stringify(
    {
      ...artifacts,
      browserLaunched: launched,
      browserLaunchErrors: launchErrors,
      counts: {
        consoleWarnings: artifacts.console.filter((c) => c.type === "warning")
          .length,
        consoleErrors: artifacts.console.filter((c) => c.type === "error")
          .length,
        pageErrors: artifacts.pageErrors.length,
        requestFailed: artifacts.requestFailed.length,
        badResponses: artifacts.badResponses.length,
        totalIssues: errCount,
      },
    },
    null,
    2
  ) + "\n"
);

