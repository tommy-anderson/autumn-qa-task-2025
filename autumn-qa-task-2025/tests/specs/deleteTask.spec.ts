import { test } from '../fixtures/base';
import { TaskData, TaskFormPage } from '../pages/TaskFormPage';
import { TaskItem } from '../pages/TaskItemPage';
import { TaskListPage } from '../pages/TaskListPage';

test.describe('Smoke', () => {

  test('Delete a single task', async ({ page }) => {
    const taskFormPage = new TaskFormPage(page);

    const taskData = {
      title: 'Title before edit',
      description: 'Description before edit',
      importance: 'Medium',
      label: 'Social'
    } as const;
    await taskFormPage.addTask(taskData);
    await TaskItem.findByTitle(page, taskData.title);
    await TaskItem.deleteTask(page, taskData.title);
    await TaskItem.expectTaskNotPresent(page, taskData.title);

  });

  test.describe('Regression', () => {
    test('Create and delete multiple tasks with counts', async ({ page }) => {
      const taskFormPage = new TaskFormPage(page);

      const tasks: readonly TaskData[] = [
        { title: 'Task 1', description: 'Description 1', importance: 'Low', label: 'Work' },
        { title: 'Task 2', description: 'Description 2', importance: 'Medium', label: 'Social' },
        { title: 'Task 3', description: 'Description 3', importance: 'High', label: 'Home' },
        { title: 'Task 4', description: 'Duplicate Title 1', importance: 'Low', label: 'Work' },
        { title: 'Task 4', description: 'Duplicate Title 2', importance: 'Medium', label: 'Social' },
      ];

      for (const task of tasks) {
        await taskFormPage.addTask(task);
      }
      await TaskListPage.assertTaskCount(page, tasks.length);
      await TaskItem.deleteByTitle(page, 'Task 1');
      await TaskListPage.assertTaskCount(page, tasks.length - 1);
      /* Bug 1 – Deleting a task removes all of the tasks that with the same title */
      await TaskItem.deleteByTitle(page, 'Task 4');
      await TaskListPage.assertTaskCount(page, tasks.length - 2);
      /* Bug 2 – Changes Revert After Refresh */
      await page.reload();
      await TaskListPage.assertTaskCount(page, tasks.length - 2);
    });
  });
});
