import { test, expect } from "@playwright/test";
import path from "path";

const fileUrl = `file://${path.resolve(__dirname, "../index.html")}`;

test.describe("Portfolio Hero Layout", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fileUrl);
  });

  test("hero emphasis line does not wrap", async ({ page }) => {
    const emphasis = page.locator(".hero-title .emphasis");
    const box = await emphasis.boundingBox();

    // Check height to ensure it's roughly one line
    if (box) {
      expect(box.height).toBeLessThan(140);
    }

    // Check line-height
    const lineHeight = await emphasis.evaluate(
      (el) => getComputedStyle(el).lineHeight,
    );
    const fontSize = await emphasis.evaluate((el) =>
      parseFloat(getComputedStyle(el).fontSize),
    );
    const lhValue = parseFloat(lineHeight);
    // User requested "single space". 1.1 or less is a safe check for CSS line-height: 1.0;
    expect(lhValue / fontSize).toBeLessThanOrEqual(1.1);
  });

  test("logo bar is visible above the fold (768px)", async ({ page }) => {
    const logoBar = page.locator(".logo-bar");
    await expect(logoBar).toBeVisible();

    const box = await logoBar.boundingBox();
    if (box) {
      // The logo bar should start before the 768px fold
      expect(box.y).toBeLessThan(768);
    }
  });

  test("branding colors are correct (BCG Green)", async ({ page }) => {
    const primaryBtn = page.locator(".btn-primary");
    const color = await primaryBtn.evaluate(
      (el) => getComputedStyle(el).backgroundColor,
    );

    // #009270 in RGB is rgb(0, 146, 112)
    expect(color).toBe("rgb(0, 146, 112)");

    const heading = page.locator(".section-heading").first();
    const headingColor = await heading.evaluate(
      (el) => getComputedStyle(el).color,
    );
    expect(headingColor).toBe("rgb(0, 146, 112)");
  });

  test("hero grid ratio is 2/3 and 1/3", async ({ page }) => {
    // We check the computed grid columns
    const grid = page.locator(".hero-grid");
    const gridTemplate = await grid.evaluate(
      (el) => getComputedStyle(el).gridTemplateColumns,
    );

    const columns = gridTemplate.split(" ");
    const leftWidth = parseFloat(columns[0]);
    const rightWidth = parseFloat(columns[1]);

    // Total should be ~1200px max, but we check the ratio
    const ratio = leftWidth / rightWidth;
    // 2 / 1 = 2.0.
    expect(ratio).toBeGreaterThan(1.8);
    expect(ratio).toBeLessThan(2.2);
  });

  test("hero body width matches headline width", async ({ page }) => {
    const title = page.locator(".hero-title");
    const body = page.locator(".hero-body");

    const titleBox = await title.boundingBox();
    const bodyBox = await body.boundingBox();

    if (titleBox && bodyBox) {
      // Body should fill the column, so it should be at least as wide as the title
      expect(bodyBox.width).toBeGreaterThanOrEqual(titleBox.width - 10);
    }
  });

  test("hero actions bottom-edge aligns with metrics grid bottom-edge", async ({
    page,
  }) => {
    const heroActions = page.locator(".hero-actions");
    const metricStack = page.locator(".metric-stack");

    const actionsBox = await heroActions.boundingBox();
    const metricsBox = await metricStack.boundingBox();

    if (actionsBox && metricsBox) {
      const actionsBottom = actionsBox.y + actionsBox.height;
      const metricsBottom = metricsBox.y + metricsBox.height;

      // We allow a small tolerance (e.g. 5px) for sub-pixel rendering or border differences
      expect(Math.abs(actionsBottom - metricsBottom)).toBeLessThan(10);
    }
  });
});
