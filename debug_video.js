const { chromium } = require("playwright");
const path = require("path");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Use absolute local file path
  const localUrl =
    "file:///" +
    path
      .resolve(
        "C:/Users/admin-beats/OneDrive/xo Vibe Coding xo/ernesto-portfolio/index.html",
      )
      .replace(/\\/g, "/");

  console.log("Navigating to:", localUrl);
  await page.goto(localUrl);

  // Scroll to Spatial Computing card
  await page.evaluate(() => {
    document.getElementById("hobbies").scrollIntoView();
  });

  // Click the card
  console.log("Clicking video card...");
  await page.click('.domain-card:has-text("Spatial Computing")');

  // Wait to see if lightbox opens
  await page.waitForTimeout(1000);

  // Take screenshot of what it looks like
  await page.screenshot({ path: "lightbox-debug.png", fullPage: false });

  // Check browser console for errors
  page.on("pageerror", (error) => {
    console.error(`Page Error: ${error.message}`);
  });
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.error(`Console Error: ${msg.text()}`);
    }
  });

  console.log("Done, screenshot taken.");
  await browser.close();
})();
