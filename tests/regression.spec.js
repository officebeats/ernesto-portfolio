// @ts-check
const { test, expect } = require("@playwright/test");

const BASE_URL =
  "file:///C:/Users/admin-beats/OneDrive/xo%20Vibe%20Coding%20xo/ernesto-portfolio/index.html";

test.describe("Certificate Modal System", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("domcontentloaded");
  });

  test("modal structure exists in DOM", async ({ page }) => {
    const modal = page.locator("#universal-modal");
    await expect(modal).toBeAttached();
    await expect(page.locator("#modal-title")).toBeAttached();
    await expect(page.locator("#modal-image-container")).toBeAttached();
    await expect(page.locator("#modal-image")).toBeAttached();
    await expect(page.locator("#modal-body")).toBeAttached();
    await expect(page.locator("#modal-link-container")).toBeAttached();
  });

  test("modal is hidden by default", async ({ page }) => {
    const modal = page.locator("#universal-modal");
    await expect(modal).toHaveCSS("display", "none");
  });

  test("all three credential triggers exist", async ({ page }) => {
    const triggers = page.locator(".modal-trigger");
    await expect(triggers).toHaveCount(3);
  });

  test("each trigger has required data attributes", async ({ page }) => {
    const triggers = page.locator(".modal-trigger");
    const count = await triggers.count();
    for (let i = 0; i < count; i++) {
      const trigger = triggers.nth(i);
      await expect(trigger).toHaveAttribute("data-modal-title", /.+/);
      await expect(trigger).toHaveAttribute("data-modal-body", /.+/);
      await expect(trigger).toHaveAttribute(
        "data-modal-image",
        /logos\/.+\.png/,
      );
    }
  });

  test("clicking AI PM credential opens modal with correct image", async ({
    page,
  }) => {
    const trigger = page.locator(
      '.modal-trigger[data-modal-title="Gen AI Product Management Specialization"]',
    );
    await trigger.click();

    const modal = page.locator("#universal-modal");
    await expect(modal).toHaveCSS("display", "flex");

    const modalTitle = page.locator("#modal-title");
    await expect(modalTitle).toHaveText(
      "Gen AI Product Management Specialization",
    );

    const modalImage = page.locator("#modal-image");
    await expect(modalImage).toHaveAttribute("src", "logos/ai-pm-cert.png");

    const imageContainer = page.locator("#modal-image-container");
    await expect(imageContainer).toHaveCSS("display", "block");
  });

  test("clicking Design Sprint credential opens modal with correct image", async ({
    page,
  }) => {
    const trigger = page.locator(
      '.modal-trigger[data-modal-title="GV Design Sprint Certified"]',
    );
    await trigger.click();

    const modal = page.locator("#universal-modal");
    await expect(modal).toHaveCSS("display", "flex");

    const modalImage = page.locator("#modal-image");
    await expect(modalImage).toHaveAttribute(
      "src",
      "logos/design-sprint-cert.png",
    );
  });

  test("clicking CSM credential opens modal with correct image", async ({
    page,
  }) => {
    const trigger = page.locator(
      '.modal-trigger[data-modal-title="Certified Scrum Master"]',
    );
    await trigger.click();

    const modal = page.locator("#universal-modal");
    await expect(modal).toHaveCSS("display", "flex");

    const modalImage = page.locator("#modal-image");
    await expect(modalImage).toHaveAttribute("src", "logos/csm-cert.png");
  });

  test("close button closes the modal", async ({ page }) => {
    // Open the modal first
    await page.locator(".modal-trigger").first().click();
    const modal = page.locator("#universal-modal");
    await expect(modal).toHaveCSS("display", "flex");

    // Click close button
    await page.locator(".close-button").click();
    await expect(modal).toHaveCSS("display", "none");
  });

  test("clicking overlay closes the modal", async ({ page }) => {
    await page.locator(".modal-trigger").first().click();
    const modal = page.locator("#universal-modal");
    await expect(modal).toHaveCSS("display", "flex");

    // Click on the modal overlay (outside .modal-content)
    await modal.click({ position: { x: 10, y: 10 } });
    await expect(modal).toHaveCSS("display", "none");
  });

  test("Escape key closes the modal", async ({ page }) => {
    await page.locator(".modal-trigger").first().click();
    const modal = page.locator("#universal-modal");
    await expect(modal).toHaveCSS("display", "flex");

    await page.keyboard.press("Escape");
    await expect(modal).toHaveCSS("display", "none");
  });

  test("body scroll is locked when modal is open", async ({ page }) => {
    await page.locator(".modal-trigger").first().click();
    await expect(page.locator("body")).toHaveClass(/modal-open/);
  });

  test("body scroll is restored when modal is closed", async ({ page }) => {
    await page.locator(".modal-trigger").first().click();
    await page.locator(".close-button").click();
    const body = page.locator("body");
    const classes = await body.getAttribute("class");
    expect(classes || "").not.toContain("modal-open");
  });

  test("certificate image files exist and load", async ({ page }) => {
    const certs = [
      "logos/ai-pm-cert.png",
      "logos/design-sprint-cert.png",
      "logos/csm-cert.png",
    ];
    for (const cert of certs) {
      const response = await page.request.get(new URL(cert, BASE_URL).href);
      expect(response.ok(), `${cert} should return 200`).toBeTruthy();
    }
  });
});

test.describe("Logo Bar", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("domcontentloaded");
  });

  test("Route logo exists in the marquee", async ({ page }) => {
    const routeLogos = page.locator('.logo-item img[alt="Route"]');
    const count = await routeLogos.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("CenterPoint Energy logo exists in the marquee", async ({ page }) => {
    const cpLogos = page.locator('.logo-item img[alt="CenterPoint Energy"]');
    const count = await cpLogos.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});

test.describe("Footer", () => {
  test("footer has BCG Green background", async ({ page }) => {
    await page.goto(BASE_URL);
    const footer = page.locator(".footer");
    await expect(footer).toHaveCSS("background-color", "rgb(0, 146, 112)");
  });

  test("footer text is white", async ({ page }) => {
    await page.goto(BASE_URL);
    const footerH2 = page.locator(".footer h2");
    await expect(footerH2).toHaveCSS("color", "rgb(255, 255, 255)");
  });
});

test.describe("Publications Section", () => {
  test("section heading says Publications", async ({ page }) => {
    await page.goto(BASE_URL);
    const heading = page.locator("#writing .section-heading");
    await expect(heading).toHaveText("Publications");
  });
});
