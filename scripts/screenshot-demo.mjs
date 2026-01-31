#!/usr/bin/env node
import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

async function waitForServer(url, maxAttempts = 60) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(url);
      if (response.ok || response.status === 404) return true;
    } catch {
      // Server not ready yet
    }
    if (i % 10 === 0) console.log(`Waiting for server... (attempt ${i + 1})`);
    await new Promise(r => setTimeout(r, 1000));
  }
  return false;
}

async function main() {
  console.log('Starting dev server on port 3456...');

  const server = spawn('npx', ['next', 'dev', '-p', '3456'], {
    cwd: projectRoot,
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: false
  });

  let serverOutput = '';
  server.stdout.on('data', (data) => {
    serverOutput += data.toString();
    if (data.toString().includes('Ready')) {
      console.log('Server reports ready');
    }
  });
  server.stderr.on('data', (data) => {
    serverOutput += data.toString();
  });

  const baseUrl = 'http://localhost:3456';

  console.log('Waiting for server to be ready...');
  const serverReady = await waitForServer(baseUrl);

  if (!serverReady) {
    console.error('Server failed to start within timeout');
    server.kill();
    process.exit(1);
  }

  // Give server a bit more time to fully initialize
  await new Promise(r => setTimeout(r, 3000));

  console.log('Server ready, launching browser...');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    // Navigate to the agentic vision page
    const demoUrl = `${baseUrl}/en/ai/llm/agentic-vision`;
    console.log(`Navigating to: ${demoUrl}`);

    await page.goto(demoUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    // Wait for page to load
    await new Promise(r => setTimeout(r, 3000));

    // Scroll down to find the demo component
    await page.evaluate(() => {
      window.scrollBy(0, 600);
    });
    await new Promise(r => setTimeout(r, 1000));

    // Take initial screenshot
    const screenshotPath = path.join(projectRoot, 'scripts', 'demo-initial.png');
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`Initial screenshot saved: ${screenshotPath}`);

    // Find and click the Start button
    const startButton = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const startBtn = buttons.find(b => b.textContent?.includes('Start') || b.querySelector('svg'));
      if (startBtn) {
        startBtn.click();
        return true;
      }
      return false;
    });

    if (startButton) {
      console.log('Clicked start button');

      // Wait for demo to complete (about 12 seconds for all animations)
      console.log('Waiting for demo to complete...');
      await new Promise(r => setTimeout(r, 14000));

      // Take final screenshot after demo completes
      const finalScreenshotPath = path.join(projectRoot, 'scripts', 'demo-complete.png');
      await page.screenshot({ path: finalScreenshotPath, fullPage: false });
      console.log(`Final screenshot saved: ${finalScreenshotPath}`);

      // Check if serial number is visible in the result
      const resultText = await page.evaluate(() => {
        const resultDiv = document.querySelector('.font-mono.text-xl');
        return resultDiv ? resultDiv.textContent : null;
      });

      if (resultText) {
        console.log(`\nDetected serial number: ${resultText}`);
        if (resultText === 'SN-4827-XK') {
          console.log('SUCCESS: Serial number matches expected value!');
        } else {
          console.log('WARNING: Serial number does not match expected SN-4827-XK');
        }
      } else {
        console.log('Could not find result element (demo may not have completed)');
      }
    } else {
      console.log('Could not find start button');
    }

  } catch (error) {
    console.error('Error during screenshot:', error.message);
  } finally {
    await browser.close();
    server.kill('SIGTERM');
    // Force kill after a delay
    setTimeout(() => {
      try { process.kill(-server.pid); } catch {}
    }, 2000);
    console.log('\nDone!');
  }
}

main().catch(console.error);
