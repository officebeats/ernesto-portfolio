// @ts-check
const { test, expect } = require("@playwright/test");

const BASE_URL =
  "file:///C:/Users/admin-beats/OneDrive/xo%20Vibe%20Coding%20xo/ernesto-portfolio/ernesto-portfolio/index.html";

test.describe("Certificate Lightbox System", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("domcontentloaded");
  });

  test("lightbox structure exists in DOM", async ({ page }) => {
    const lightbox = page.locator("#img-lightbox");
    await expect(lightbox).toBeAttached();
    await expect(page.locator("#lightbox-img")).toBeAttached();
    await expect(page.locator("#lightbox-video")).toBeAttached();
  });

  test("lightbox is hidden by default", async ({ page }) => {
    const lightbox = page.locator("#img-lightbox");
    await expect(lightbox).toHaveCSS("display", "none");
  });

  test("all three credential triggers exist", async ({ page }) => {
    const triggers = page.locator(".cred-item[onclick]");
    await expect(triggers).toHaveCount(3);
  });

  test("clicking AI PM credential opens lightbox with correct image", async ({
    page,
  }) => {
    const trigger = page.locator(
      '.cred-item:has-text("Gen AI Product Management")',
    );
    await trigger.click();

    const lightbox = page.locator("#img-lightbox");
    await expect(lightbox).toHaveCSS("display", "flex");

    const lightboxImg = page.locator("#lightbox-img");
    await expect(lightboxImg).toHaveAttribute("src", "logos/ai-pm-cert.png");
    await expect(lightboxImg).toBeVisible();
  });

  test("close lightbox on background click", async ({ page }) => {
    await page.locator(".cred-item[onclick]").first().click();
    const lightbox = page.locator("#img-lightbox");
    await expect(lightbox).toHaveCSS("display", "flex");

    // Click on the lightbox background
    await lightbox.click({ position: { x: 10, y: 10 } });
    await expect(lightbox).toHaveCSS("display", "none");
  });

  test("Escape key closes the lightbox", async ({ page }) => {
    await page.locator(".cred-item[onclick]").first().click();
    const lightbox = page.locator("#img-lightbox");
    await expect(lightbox).toHaveCSS("display", "flex");

    await page.keyboard.press("Escape");
    await expect(lightbox).toHaveCSS("display", "none");
  });

  test("certificate image files exist and load", async ({ page }) => {
    const certs = [
      "logos/ai-pm-cert.png",
      "logos/design-sprint-cert.png",
      "logos/csm-cert.png",
    ];
    for (const cert of certs) {
      const imgUrl = new URL(cert, BASE_URL).href;
      const response = await page.goto(imgUrl);
      expect(response.status()).toBe(200);
    }
  });
});

test.describe("Logo Bar", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");
  });

  test("Route logo exists in the marquee", async ({ page }) => {
    const routeLogo = page.locator('.logo-item img[alt="Route"]').first();
    await expect(routeLogo).toBeAttached();
  });

  test("CenterPoint Energy logo exists in the marquee", async ({ page }) => {
    const cpLogo = page
      .locator('.logo-item img[alt="CenterPoint Energy"]')
      .first();
    await expect(cpLogo).toBeAttached();
  });
});

test.describe("Footer", () => {
  test("footer has BCG Green background", async ({ page }) => {
    await page.goto(BASE_URL);
    const footer = page.locator(".footer");
    // Using a regex to match both rgb and rgba variations or slightly different shades
    await expect(footer).toHaveCSS("background-color", /rgb\(0, 146, 112\)/);
  });

  test("footer text is appropriate for theme", async ({ page }) => {
    await page.goto(BASE_URL);
    // Page defaults to dark mode - footer text should be black in dark mode
    const footerH2 = page.locator(".footer h2");
    // In dark mode, footer text is black (see CSS [data-theme="dark"] .footer h2)
    const color = await footerH2.evaluate((el) => getComputedStyle(el).color);
    // Should be black in dark mode
    expect(color).toMatch(/rgb\(0, 0, 0\)|rgb\(0,0,0\)/);
  });
});

test.describe("Publications Section", () => {
  test("section heading says Publications", async ({ page }) => {
    await page.goto(BASE_URL);
    // Scrolling to the section to ensure it's loaded if lazy
    await page.locator("#writing").scrollIntoViewIfNeeded();
    const heading = page.locator("#writing .section-heading");
    await expect(heading).toHaveText("Publications");
  });
});
