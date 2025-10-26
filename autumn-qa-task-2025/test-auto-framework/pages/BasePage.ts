import { Page, Locator } from '@playwright/test';

/**
 * Base Page Object class
 * 
 * This abstract class provides common functionality that is shared across all page objects.
 * It implements the Page Object Model (POM) design pattern to promote code reusability
 * and maintainability.
 * 
 * Key Features:
 * - Navigation utilities
 * - Wait strategies
 * - Screenshot capabilities
 * - Element visibility checks
 * 
 * Usage:
 * All page objects should extend this class to inherit common functionality.
 * 
 * @example
 * export class MyPage extends BasePage {
 *   constructor(page: Page) {
 *     super(page);
 *   }
 * }
 */
export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   * 
   * @param url - Relative or absolute URL to navigate to
   * @example
   * await basePage.goto('/tasks');
   */
  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Wait for the page to load
   * 
   * Waits for the DOM content to be fully loaded.
   * 
   * @example
   * await basePage.waitForPageLoad();
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Wait for network to be idle
   * 
   * Useful when waiting for API calls to complete.
   * 
   * @example
   * await basePage.waitForNetworkIdle();
   */
  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Take a screenshot
   * 
   * Captures a full-page screenshot and saves it to the specified path.
   * 
   * @param name - Name of the screenshot file (without extension)
   * @example
   * await basePage.takeScreenshot('error-state');
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ 
      path: `screenshots/${name}.png`, 
      fullPage: true 
    });
  }

  /**
   * Take a screenshot and return as buffer
   * 
   * @returns Screenshot buffer
   * @example
   * const buffer = await basePage.takeScreenshotBuffer();
   */
  async takeScreenshotBuffer(): Promise<Buffer> {
    return await this.page.screenshot({ fullPage: true });
  }

  /**
   * Get page title
   * 
   * @returns The page title
   * @example
   * const title = await basePage.getTitle();
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get current URL
   * 
   * @returns The current page URL
   * @example
   * const url = await basePage.getUrl();
   */
  async getUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Wait for a specific timeout
   * 
   * Note: Use sparingly. Prefer explicit waits when possible.
   * 
   * @param milliseconds - Time to wait in milliseconds
   * @example
   * await basePage.wait(1000); // Wait 1 second
   */
  async wait(milliseconds: number): Promise<void> {
    await this.page.waitForTimeout(milliseconds);
  }

  /**
   * Reload the page
   * 
   * @example
   * await basePage.reload();
   */
  async reload(): Promise<void> {
    await this.page.reload();
  }

  /**
   * Go back in browser history
   * 
   * @example
   * await basePage.goBack();
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  /**
   * Go forward in browser history
   * 
   * @example
   * await basePage.goForward();
   */
  async goForward(): Promise<void> {
    await this.page.goForward();
  }

  /**
   * Check if element is visible
   * 
   * @param locator - Playwright locator
   * @returns True if element is visible
   * @example
   * const isVisible = await basePage.isVisible(page.locator('.element'));
   */
  async isVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  /**
   * Check if element is enabled
   * 
   * @param locator - Playwright locator
   * @returns True if element is enabled
   * @example
   * const isEnabled = await basePage.isEnabled(page.locator('button'));
   */
  async isEnabled(locator: Locator): Promise<boolean> {
    return await locator.isEnabled();
  }

  /**
   * Wait for element to be visible
   * 
   * @param locator - Playwright locator
   * @param timeout - Maximum time to wait in milliseconds (default: 30000)
   * @example
   * await basePage.waitForVisible(page.locator('.loading'), 5000);
   */
  async waitForVisible(locator: Locator, timeout: number = 30000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for element to be hidden
   * 
   * @param locator - Playwright locator
   * @param timeout - Maximum time to wait in milliseconds (default: 30000)
   * @example
   * await basePage.waitForHidden(page.locator('.spinner'), 5000);
   */
  async waitForHidden(locator: Locator, timeout: number = 30000): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Execute JavaScript in the page context
   * 
   * @param script - JavaScript code to execute
   * @param arg - Optional argument to pass to the script
   * @returns Result of the script execution
   * @example
   * const result = await basePage.evaluate(() => document.title);
   */
  async evaluate<T>(script: string | ((arg?: any) => T), arg?: any): Promise<T> {
    return await this.page.evaluate(script as any, arg);
  }

  /**
   * Clear browser storage (localStorage and sessionStorage)
   * 
   * @example
   * await basePage.clearStorage();
   */
  async clearStorage(): Promise<void> {
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }
}

