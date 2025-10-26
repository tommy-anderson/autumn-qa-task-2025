/**
 * Wait Helper Utility
 * 
 * Provides advanced waiting strategies for test automation.
 * These utilities help manage timing issues and ensure proper synchronization.
 * 
 * Key Features:
 * - Simple delay waits
 * - Exponential backoff retry logic
 * - Polling with timeout
 * 
 * @example
 * // Wait for condition with polling
 * const success = await WaitHelper.pollUntil(
 *   async () => await page.isVisible('.element'),
 *   5000,
 *   500
 * );
 */
export class WaitHelper {
  /**
   * Wait for a specific amount of time
   * 
   * Simple delay function that pauses execution.
   * 
   * @param milliseconds - Time to wait in milliseconds
   * 
   * @example
   * await WaitHelper.wait(1000); // Wait 1 second
   */
  static async wait(milliseconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  /**
   * Retry an action with exponential backoff
   * 
   * Attempts an action multiple times with increasing delays between attempts.
   * Useful for flaky operations or resource availability checks.
   * 
   * @param action - Async function that returns true on success, false on failure
   * @param maxAttempts - Maximum number of attempts (default: 5)
   * @param initialDelay - Initial delay in milliseconds (default: 1000)
   * @returns True if action succeeded within max attempts, false otherwise
   * 
   * @example
   * const success = await WaitHelper.waitWithBackoff(
   *   async () => {
   *     const response = await fetch('/api/status');
   *     return response.ok;
   *   },
   *   5,
   *   1000
   * );
   * // Tries with delays: 1s, 2s, 4s, 8s, 16s
   */
  static async waitWithBackoff(
    action: () => Promise<boolean>,
    maxAttempts: number = 5,
    initialDelay: number = 1000
  ): Promise<boolean> {
    let delay = initialDelay;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const result = await action();
      if (result) {
        return true;
      }
      
      if (attempt < maxAttempts - 1) {
        await this.wait(delay);
        delay *= 2; // Exponential backoff
      }
    }
    
    return false;
  }

  /**
   * Poll a condition until it's met or timeout occurs
   * 
   * Repeatedly checks a condition at regular intervals until it returns true
   * or the timeout is reached.
   * 
   * @param condition - Async function that returns true when condition is met
   * @param timeoutMs - Maximum time to wait in milliseconds (default: 10000)
   * @param intervalMs - Interval between checks in milliseconds (default: 500)
   * @returns True if condition was met, false if timeout occurred
   * 
   * @example
   * const isReady = await WaitHelper.pollUntil(
   *   async () => {
   *     const count = await taskManagerPage.getTaskCount();
   *     return count === 5;
   *   },
   *   5000,  // 5 second timeout
   *   200    // Check every 200ms
   * );
   */
  static async pollUntil(
    condition: () => Promise<boolean>,
    timeoutMs: number = 10000,
    intervalMs: number = 500
  ): Promise<boolean> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      try {
        const result = await condition();
        if (result) {
          return true;
        }
      } catch (error) {
        // Continue polling even if condition throws an error
      }
      await this.wait(intervalMs);
    }
    
    return false;
  }

  /**
   * Wait for multiple conditions to be true
   * 
   * @param conditions - Array of condition functions
   * @param timeoutMs - Maximum time to wait (default: 10000)
   * @returns True if all conditions are met, false otherwise
   * 
   * @example
   * const allReady = await WaitHelper.waitForAll([
   *   async () => await page.isVisible('.header'),
   *   async () => await page.isVisible('.footer'),
   *   async () => await page.isVisible('.content')
   * ], 5000);
   */
  static async waitForAll(
    conditions: Array<() => Promise<boolean>>,
    timeoutMs: number = 10000
  ): Promise<boolean> {
    return await this.pollUntil(
      async () => {
        const results = await Promise.all(conditions.map(c => c()));
        return results.every(r => r === true);
      },
      timeoutMs
    );
  }

  /**
   * Wait for any of the conditions to be true
   * 
   * @param conditions - Array of condition functions
   * @param timeoutMs - Maximum time to wait (default: 10000)
   * @returns True if any condition is met, false otherwise
   * 
   * @example
   * const anyReady = await WaitHelper.waitForAny([
   *   async () => await page.isVisible('.success-message'),
   *   async () => await page.isVisible('.error-message')
   * ], 5000);
   */
  static async waitForAny(
    conditions: Array<() => Promise<boolean>>,
    timeoutMs: number = 10000
  ): Promise<boolean> {
    return await this.pollUntil(
      async () => {
        const results = await Promise.all(
          conditions.map(c => c().catch(() => false))
        );
        return results.some(r => r === true);
      },
      timeoutMs
    );
  }
}

