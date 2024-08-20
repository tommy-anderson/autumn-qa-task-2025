import { test as baseTest } from "@playwright/test";
import { TaskManagerPage } from "../pages/taskManagerPage";

type TaskManagerFixtures = {
  taskManagerPage: TaskManagerPage;
};

export const test = baseTest.extend<TaskManagerFixtures>({
  taskManagerPage: async ({ page }, use) => {
    // Setup fixture
    const taskManagerPage = new TaskManagerPage(page);
    await taskManagerPage.goToTaskManagerApp();

    // Use fixture value in the test
    await use(taskManagerPage);

    // Close the page when the test is finished
    await page.close();
  },
});

export { expect } from "@playwright/test";
