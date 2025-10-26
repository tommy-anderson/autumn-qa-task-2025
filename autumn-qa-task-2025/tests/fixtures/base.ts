import { test as baseTest, expect } from '@playwright/test';
import { TaskFormPage } from '../pages/TaskFormPage';
import { TaskListPage } from '../pages/TaskListPage';

// Extend the base Playwright test
export const test = baseTest.extend<{
  taskFormPage: TaskFormPage;
  taskListPage: TaskListPage;
}>({
  // Navigate to the app before each test
  page: async ({ page }, use) => {
    await page.goto('http://localhost:5173/');
    await use(page);
  },

  // Inject page objects
  taskFormPage: async ({ page }, use) => {
    await use(new TaskFormPage(page));
  },
  taskListPage: async ({ page }, use) => {
    await use(new TaskListPage(page));
  },
});

export { expect };
