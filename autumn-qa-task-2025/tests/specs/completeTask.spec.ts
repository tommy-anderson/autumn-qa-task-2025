import { test } from '../fixtures/base';
import { TaskFormPage } from '../pages/TaskFormPage';
import { TaskItem } from '../pages/TaskItemPage';

test.describe('Smoke', () => {

  test('Complete a task', async ({ page }) => {
    const taskFormPage = new TaskFormPage(page);
    const taskData = {
      title: 'Task to be completed',
    } as const;
    await taskFormPage.addTask(taskData);
    const taskItem = await TaskItem.findByTitle(page, taskData.title);
    await taskItem.complete();
    await taskItem.verifyNewTaskDetails(taskData, 'uncomplete');
  });

  test.describe('Regression', () => {
    test('Revert task to original state', async ({ page }) => {
      const taskFormPage = new TaskFormPage(page);
      const taskData = {
        title: 'Task to be completed',
      } as const;
      await taskFormPage.addTask(taskData);
      const taskItem = await TaskItem.findByTitle(page, taskData.title);
      await taskItem.complete();
      await taskItem.verifyNewTaskDetails(taskData, 'uncomplete');
      await taskItem.uncomplete();
      await taskItem.verifyNewTaskDetails(taskData, 'complete');
    });
  });
});
