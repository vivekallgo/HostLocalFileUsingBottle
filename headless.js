const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    executablePath:
      "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"
  });
  const page = await browser.newPage();
  await page.goto("https://github.com/GoogleChrome/puppeteer/issues/2249");
  await page.pdf({ path: "example.pdf" });

  await browser.close();
})();
