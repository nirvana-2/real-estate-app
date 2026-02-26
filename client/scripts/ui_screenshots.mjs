import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE_URL = "http://127.0.0.1:5173/";
const PASSWORD = "Test12345!";

function safeTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

async function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

async function maybeFill(locator, value) {
  if ((await locator.count()) > 0) {
    await locator.first().fill(value);
    return true;
  }
  return false;
}

async function clickFirstVisible(candidates) {
  for (const { name, locator } of candidates) {
    const l = locator();
    if ((await l.count()) === 0) continue;
    try {
      await l.first().waitFor({ state: "visible", timeout: 1500 });
      await l.first().click();
      return name;
    } catch {
      // try next
    }
  }
  throw new Error(
    `No clickable element found. Tried: ${candidates.map((c) => c.name).join(", ")}`
  );
}

async function main() {
  const ts = safeTimestamp();
  const email = `tenant+${ts}@example.com`;
  const outDir = path.resolve("artifacts/screenshots", ts);
  await ensureDir(outDir);

  const issues = [];

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on("pageerror", (err) => issues.push(`pageerror: ${String(err)}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") issues.push(`console.error: ${msg.text()}`);
  });
  page.on("requestfailed", (req) => {
    const failure = req.failure();
    issues.push(
      `requestfailed: ${req.method()} ${req.url()}${failure?.errorText ? ` (${failure.errorText})` : ""}`
    );
  });

  try {
    await page.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(500);

    const landingPath = path.join(outDir, "01-landing.png");
    await page.screenshot({ path: landingPath, fullPage: true });

    // Navigate to registration
    try {
      await clickFirstVisible([
        { name: "link:Register", locator: () => page.getByRole("link", { name: /register/i }) },
        { name: "link:Sign up", locator: () => page.getByRole("link", { name: /sign\s*up|signup/i }) },
        { name: "button:Register", locator: () => page.getByRole("button", { name: /register/i }) },
        { name: "button:Sign up", locator: () => page.getByRole("button", { name: /sign\s*up|signup/i }) },
      ]);
    } catch (e) {
      issues.push(`Could not find Register/Sign up entry point: ${String(e)}`);
      throw e;
    }

    // If there is a role/account-type step, select TENANT
    try {
      await clickFirstVisible([
        { name: "radio:Tenant", locator: () => page.getByRole("radio", { name: /tenant/i }) },
        { name: "button:Tenant", locator: () => page.getByRole("button", { name: /tenant/i }) },
        { name: "text:Tenant", locator: () => page.getByText(/tenant/i) },
      ]);
    } catch {
      // It's fine if the UI doesn't require explicit selection.
    }

    // Fill registration form (best-effort based on labels/placeholders)
    const filled = [];
    if (await maybeFill(page.getByLabel(/full\s*name|name/i), "Test Tenant")) filled.push("name");
    if (await maybeFill(page.getByLabel(/email/i), email)) filled.push("email");
    if (!filled.includes("email")) {
      if (await maybeFill(page.getByPlaceholder(/email/i), email)) filled.push("email");
    }

    // Password / confirm password
    if (await maybeFill(page.getByLabel(/^password$/i), PASSWORD)) filled.push("password");
    if (!filled.includes("password")) {
      if (await maybeFill(page.getByLabel(/password/i), PASSWORD)) filled.push("password");
    }

    await maybeFill(page.getByLabel(/confirm\s*password|repeat\s*password/i), PASSWORD);
    await maybeFill(page.getByPlaceholder(/confirm\s*password|repeat\s*password/i), PASSWORD);

    // Submit
    await clickFirstVisible([
      { name: "button:Create account", locator: () => page.getByRole("button", { name: /create\s*account/i }) },
      { name: "button:Register", locator: () => page.getByRole("button", { name: /register/i }) },
      { name: "button:Sign up", locator: () => page.getByRole("button", { name: /sign\s*up|signup/i }) },
      { name: "button:Submit", locator: () => page.getByRole("button", { name: /submit/i }) },
    ]);

    // Confirm redirect to home (URL heuristic + presence of property cards)
    try {
      await page.waitForURL(/\/($|home|properties|listings)/i, { timeout: 20000 });
    } catch {
      // URL might not change; continue and just screenshot current state.
      issues.push(`Did not observe a clear URL redirect after registration (current URL: ${page.url()})`);
    }

    await page.waitForTimeout(750);
    const afterRegPath = path.join(outDir, "02-after-register-home.png");
    await page.screenshot({ path: afterRegPath, fullPage: true });

    // Open a property detail page by clicking a card/link.
    try {
      await clickFirstVisible([
        {
          name: "link:/properties/*",
          locator: () => page.locator("a[href*='/properties/']"),
        },
        {
          name: "link:/property/*",
          locator: () => page.locator("a[href*='/property/']"),
        },
        {
          name: "first card link",
          locator: () => page.locator("a").filter({ hasText: /view|details|see more/i }),
        },
      ]);
    } catch (e) {
      issues.push(`Could not find a property card/link to click: ${String(e)}`);
      throw e;
    }

    try {
      await page.waitForURL(/\/(properties|property|listing|listings)\//i, { timeout: 15000 });
    } catch {
      // Still take a screenshot of whatever opened.
      issues.push(`Property detail URL pattern not detected (current URL: ${page.url()})`);
    }

    await page.waitForTimeout(750);
    const detailPath = path.join(outDir, "03-property-detail.png");
    await page.screenshot({ path: detailPath, fullPage: true });

    const result = {
      timestamp: ts,
      email,
      password: PASSWORD,
      baseUrl: BASE_URL,
      screenshots: {
        landing: landingPath,
        afterRegisterHome: afterRegPath,
        propertyDetail: detailPath,
      },
      issues,
    };

    // Print JSON so the runner can easily report paths.
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    const errorShot = path.join(outDir, "99-error.png");
    try {
      await page.screenshot({ path: errorShot, fullPage: true });
    } catch {
      // ignore
    }
    // eslint-disable-next-line no-console
    console.error(String(err));
    // eslint-disable-next-line no-console
    console.error(`Saved error screenshot (if possible): ${errorShot}`);
    // eslint-disable-next-line no-console
    console.error(JSON.stringify({ issues }, null, 2));
    process.exitCode = 1;
  } finally {
    await context.close();
    await browser.close();
  }
}

main();
