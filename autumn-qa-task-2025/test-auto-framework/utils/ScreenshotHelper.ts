import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Screenshot Helper Utility
 * 
 * This utility class provides methods for capturing screenshots during test execution.
 * It helps with debugging test failures and documenting test scenarios.
 * 
 * Key Features:
 * - Automatic timestamp-based naming
 * - Full page screenshots
 * - Element-specific screenshots
 * - Sequential screenshot capture
 * - Automatic directory management
 * 
 * @example
 * const screenshotHelper = new ScreenshotHelper('test-screenshots');
 * await screenshotHelper.takeScreenshot(page, 'login-page');
 */
export class ScreenshotHelper {
  private screenshotDir: string;

  /**
   * Create a new ScreenshotHelper instance
   * 
   * @param screenshotDir - Directory to save screenshots (default: 'screenshots')
   */
  constructor(screenshotDir: string = 'screenshots') {
    this.screenshotDir = screenshotDir;
    this.ensureDirectoryExists();
  }

  /**
   * Ensure screenshot directory exists
   * 
   * Creates the directory if it doesn't exist.
   * 
   * @private
   */
  private ensureDirectoryExists(): void {
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
  }

  /**
   * Take a full-page screenshot with automatic timestamp
   * 
   * The screenshot will be saved with a timestamp to avoid naming conflicts.
   * 
   * @param page - Playwright page object
   * @param name - Base name for the screenshot file
   * @returns Path to the saved screenshot
   * 
   * @example
   * const path = await screenshotHelper.takeScreenshot(page, 'task-list');
   * // Saves as: screenshots/task-list_2024-01-15T10-30-45.123Z.png
   */
  async takeScreenshot(page: Page, name: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const filename = `${name}_${timestamp}.png`;
    const filepath = path.join(this.screenshotDir, filename);
    
    await page.screenshot({ path: filepath, fullPage: true });
    return filepath;
  }

  /**
   * Take a screenshot of a specific element
   * 
   * Captures only the specified element instead of the full page.
   * 
   * @param page - Playwright page object
   * @param selector - CSS selector of the element to capture
   * @param name - Base name for the screenshot file
   * @returns Path to the saved screenshot
   * 
   * @example
   * const path = await screenshotHelper.takeElementScreenshot(
   *   page, 
   *   '.task-item', 
   *   'single-task'
   * );
   */
  async takeElementScreenshot(page: Page, selector: string, name: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const filename = `${name}_${timestamp}.png`;
    const filepath = path.join(this.screenshotDir, filename);
    
    const element = page.locator(selector);
    await element.screenshot({ path: filepath });
    return filepath;
  }

  /**
   * Take multiple screenshots in sequence with delays
   * 
   * Useful for capturing animation states or step-by-step processes.
   * 
   * @param page - Playwright page object
   * @param baseName - Base name for the screenshot files
   * @param count - Number of screenshots to take
   * @param delayMs - Delay between screenshots in milliseconds (default: 1000)
   * @returns Array of paths to the saved screenshots
   * 
   * @example
   * const paths = await screenshotHelper.takeSequentialScreenshots(
   *   page, 
   *   'animation', 
   *   5, 
   *   500
   * );
   * // Saves as: animation_step_1.png, animation_step_2.png, etc.
   */
  async takeSequentialScreenshots(
    page: Page, 
    baseName: string, 
    count: number, 
    delayMs: number = 1000
  ): Promise<string[]> {
    const screenshots: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const name = `${baseName}_step_${i + 1}`;
      const filepath = await this.takeScreenshot(page, name);
      screenshots.push(filepath);
      
      if (i < count - 1) {
        await page.waitForTimeout(delayMs);
      }
    }
    
    return screenshots;
  }

  /**
   * Take a screenshot on test failure
   * 
   * Should be called in test hooks or error handlers.
   * 
   * @param page - Playwright page object
   * @param testName - Name of the failed test
   * @returns Path to the saved screenshot
   * 
   * @example
   * test.afterEach(async ({ page }, testInfo) => {
   *   if (testInfo.status === 'failed') {
   *     await screenshotHelper.takeFailureScreenshot(page, testInfo.title);
   *   }
   * });
   */
  async takeFailureScreenshot(page: Page, testName: string): Promise<string> {
    const sanitizedName = testName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    return await this.takeScreenshot(page, `FAILURE_${sanitizedName}`);
  }

  /**
   * Get the screenshot directory path
   * 
   * @returns The directory where screenshots are saved
   */
  getScreenshotDirectory(): string {
    return this.screenshotDir;
  }

  /**
   * Clear all screenshots from the directory
   * 
   * Warning: This will delete all files in the screenshot directory!
   * 
   * @example
   * screenshotHelper.clearScreenshots();
   */
  clearScreenshots(): void {
    if (fs.existsSync(this.screenshotDir)) {
      const files = fs.readdirSync(this.screenshotDir);
      for (const file of files) {
        fs.unlinkSync(path.join(this.screenshotDir, file));
      }
    }
  }
}

