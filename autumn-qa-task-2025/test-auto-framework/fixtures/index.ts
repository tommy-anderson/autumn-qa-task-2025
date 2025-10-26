import { test as base } from '@playwright/test';
import { TaskManagerPage } from '../pages';
import { TaskService, TestDataService } from '../services';
import { ScreenshotHelper, Logger } from '../utils';

/**
 * Custom Playwright Fixtures
 * 
 * This file extends Playwright's base test with custom fixtures that provide
 * pre-configured instances of page objects, services, and utilities.
 * 
 * Benefits of using fixtures:
 * - Automatic setup and teardown
 * - Dependency injection
 * - Consistent test environment
 * - Reduced boilerplate code
 * 
 * Usage:
 * Import these fixtures instead of Playwright's base test:
 * 
 * @example
 * import { test, expect } from '../fixtures';
 * 
 * test('my test', async ({ taskManagerPage, taskService }) => {
 *   // taskManagerPage is already navigated to the app
 *   const task = taskService.createValidTask();
 *   await taskManagerPage.addTask(task);
 * });
 */

/**
 * Type definition for custom fixtures
 */
type TaskManagerFixtures = {
  /** Task Manager Page Object - automatically navigates to the app */
  taskManagerPage: TaskManagerPage;
  /** Task Service for generating test data */
  taskService: typeof TaskService;
  /** Test Data Service for managing application state */
  testDataService: TestDataService;
  /** Screenshot Helper for capturing screenshots */
  screenshotHelper: ScreenshotHelper;
  /** Logger for test logging */
  logger: Logger;
};

/**
 * Extended Playwright test with custom fixtures
 * 
 * Each fixture is automatically set up before the test runs and
 * cleaned up after the test completes.
 */
export const test = base.extend<TaskManagerFixtures>({
  /**
   * Task Manager Page Object Fixture
   * 
   * Provides a fully initialized TaskManagerPage instance.
   * Automatically navigates to the application before the test runs.
   * 
   * @example
   * test('add task', async ({ taskManagerPage }) => {
   *   await taskManagerPage.addTask({ title: 'My Task' });
   * });
   */
  taskManagerPage: async ({ page }, use) => {
    const taskManagerPage = new TaskManagerPage(page);
    await taskManagerPage.navigate();
    await use(taskManagerPage);
  },

  /**
   * Task Service Fixture
   * 
   * Provides access to TaskService static methods for generating
   * valid test data, creating task combinations, and validation.
   * 
   * This is a stateless service, so we pass the class itself.
   * 
   * @example
   * test('test', async ({ taskService }) => {
   *   const task = taskService.createValidTask({ title: 'Test' });
   *   const tasks = taskService.generateAllCombinations();
   * });
   */
  taskService: async ({}, use) => {
    await use(TaskService);
  },

  /**
   * Test Data Service Fixture
   * 
   * Provides methods for managing test data and application state.
   * Includes automatic cleanup after the test completes.
   * 
   * @example
   * test('test', async ({ testDataService }) => {
   *   await testDataService.setupTestData([task1, task2]);
   *   const stored = await testDataService.getStoredTasks();
   *   // Automatic cleanup happens after test
   * });
   */
  testDataService: async ({ page }, use) => {
    const testDataService = new TestDataService(page);
    await use(testDataService);
    // Cleanup: Reset state after test
    await testDataService.resetState();
  },

  /**
   * Screenshot Helper Fixture
   * 
   * Provides utilities for capturing screenshots during tests.
   * Useful for debugging and documenting test scenarios.
   * 
   * @example
   * test('test', async ({ page, screenshotHelper }) => {
   *   await screenshotHelper.takeScreenshot(page, 'before-action');
   *   // perform action
   *   await screenshotHelper.takeScreenshot(page, 'after-action');
   * });
   */
  screenshotHelper: async ({}, use) => {
    const screenshotHelper = new ScreenshotHelper();
    await use(screenshotHelper);
  },

  /**
   * Logger Fixture
   * 
   * Provides a singleton logger instance for test logging.
   * Automatically clears logs before each test.
   * 
   * @example
   * test('test', async ({ logger }) => {
   *   logger.info('Starting test');
   *   logger.error('An error occurred');
   *   const logs = logger.getLogs();
   * });
   */
  logger: async ({}, use) => {
    const logger = Logger.getInstance();
    logger.clearLogs();
    await use(logger);
  },
});

/**
 * Re-export expect from Playwright for convenience
 * 
 * @example
 * import { test, expect } from '../fixtures';
 * expect(value).toBe(expected);
 */
export { expect } from '@playwright/test';

