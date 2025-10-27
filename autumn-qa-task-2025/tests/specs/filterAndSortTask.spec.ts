import { test } from '../fixtures/base';
import { TaskFormPage } from '../pages/TaskFormPage';
import { TaskListPage } from '../pages/TaskListPage';

test.describe('Smoke', () => {

  test('Filter by Work and sort by descending importance', async ({ page }) => {
    const taskFormPage = new TaskFormPage(page);
    const taskListPage = new TaskListPage(page);

    await taskFormPage.expectFormVisible();
    const tasks = [
      { title: 'A Task', label: 'Work', importance: 'High' },
      { title: 'B Task', label: 'Work', importance: 'Medium' },
      { title: 'C Task', label: 'Work', importance: 'Low' },
      { title: 'D Task', label: 'Home', importance: 'Medium' },
      { title: 'E Task', label: 'Hobby', importance: 'Low' },
      { title: 'F Task', label: 'Social', importance: 'Medium' },
    ] as const;

    for (const t of tasks) {
      await taskListPage.addCombinationTask(t as any); // reuse existing add task
    }

    await taskListPage.filterByLabel('Work');
    await taskListPage.sortByImportance('desc');
    /* Bug 7 – Sorting Logic Is Incorrect */
    await taskListPage.verifyTaskSortAndFilter(['A Task', 'B Task', 'C Task']);
  });
});

test.describe('Regression', () => {
  test('Filter by label and verify result', async ({ page }) => {
    const taskFormPage = new TaskFormPage(page);
    const taskListPage = new TaskListPage(page);
    await taskFormPage.expectFormVisible();

    const tasks = [
      { title: 'A Alpha', label: 'Work', importance: 'Medium' },
      { title: 'B Beta', label: 'Home', importance: 'Medium' },
      { title: 'C Gamma', label: 'Social', importance: 'Medium' },
    ] as const;

    for (const t of tasks) {
      await taskListPage.addCombinationTask(t as any);
    }

    await taskListPage.filterByLabel('Home');
    await taskListPage.verifyTaskSortAndFilter(['B Beta']);
  });

  test('Sort by importance and verify result', async ({ page }) => {
    const taskFormPage = new TaskFormPage(page);
    const taskListPage = new TaskListPage(page);
    await taskFormPage.expectFormVisible();

    const tasks = [
      { title: 'A One', label: 'Work', importance: 'High' },
      { title: 'B Two', label: 'Home', importance: 'Medium' },
      { title: 'C Three', label: 'Hobby', importance: 'Low' },
      { title: 'D Four', label: 'Social', importance: 'Medium' },
    ] as const;

    for (const t of tasks) {
      await taskListPage.addCombinationTask(t as any);
    }
    await taskListPage.sortByImportance('asc');
    /* Bug 7 – Sorting Logic Is Incorrect */
    await taskListPage.verifyTaskSortAndFilter(['C Three', 'B Two', 'D Four', 'A One']);
  });
});
