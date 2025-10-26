import { test } from '../fixtures/base';
import { TaskFormPage } from '../pages/TaskFormPage';
import { TaskItem } from '../pages/TaskItemPage';
import { TaskListPage } from '../pages/TaskListPage';

test.describe('Smoke', () => {

  test('Edit all fields of a task', async ({ page }) => {
    const taskFormPage = new TaskFormPage(page);

    const taskData = {
      title: 'Title before edit',
      description: 'Description before edit',
      importance: 'Medium',
      label: 'Social'
    } as const;
    await taskFormPage.addTask(taskData);
    const taskItem = await TaskItem.findByTitle(page, taskData.title);
    const updatedTaskData = {
      title: 'Updated Title',
      description: 'Updated Description',
      importance: 'High',
      label: 'Work'
    } as const;
    await taskItem.editTask(updatedTaskData);
    const updatedTaskItem = await TaskItem.findByTitle(page, updatedTaskData.title);
    /* Bug 11 – Editing Task Sets Status to Complete:true*/
    await updatedTaskItem.verifyNewTaskDetails(updatedTaskData, 'complete');
  });
});

test.describe('Regression', () => {

  test('Cancell an edit', async ({ page }) => {
    const taskFormPage = new TaskFormPage(page);
    const taskListPage = new TaskListPage(page);

    const taskData = {
      title: 'Original Title',
      description: 'Original Description',
      importance: 'Low',
      label: 'Work'
    } as const;
    await taskFormPage.addTask(taskData);
    const taskItem = await TaskItem.findByTitle(page, taskData.title);
    await taskItem.edit();
    /* Bug 10 – Editing With No Changes Resets Task Parameters */
    await taskItem.verifyEditFormPrefill(taskData);
    await taskItem.cancel();
    /* Bug 11 – Editing Task Sets Status to Complete:true */
    await taskListPage.verifyNewTaskElements(taskData, 'complete');
  });
});
