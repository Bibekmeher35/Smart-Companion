const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');
    
    // Ensure dyslexia mode is active (it's active by default in the screenshot or we can set localStorage)
    // Actually, just click the sidebar toggle first
    await page.waitForSelector('.sidebar-toggle');
    await page.click('.sidebar-toggle');
    
    // Wait for animation
    await page.waitForTimeout(1000);
    
    // Get the outerHTML of the active nav button
    const html = await page.evaluate(() => {
      const btn = document.querySelector('.sidebar.closed nav button');
      return btn ? btn.outerHTML : 'Button not found';
    });
    
    console.log(html);
    
    // Also get computed styles of nav-icon
    const computedStyles = await page.evaluate(() => {
      const icon = document.querySelector('.sidebar.closed nav button .nav-icon');
      if (!icon) return 'No icon found';
      const styles = window.getComputedStyle(icon);
      return {
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity,
        width: styles.width,
        height: styles.height,
        color: styles.color,
        svgDisplay: icon.querySelector('svg') ? window.getComputedStyle(icon.querySelector('svg')).display : 'No SVG'
      };
    });
    console.log(JSON.stringify(computedStyles, null, 2));
    
    await browser.close();
  } catch (err) {
    console.error(err);
  }
})();
