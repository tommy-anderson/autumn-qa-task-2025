import { test, expect } from '@playwright/test';
import { TaskManagerMainPage } from '../page-object/TaskManagerMainPage';

test('User can add a task', async ({ page }) => {
  const taskManager = new TaskManagerMainPage(page);

  await page.goto('http://localhost:4174/');
  await taskManager.addTask();
})

test('User can remove a task', async ({ page }) => {
  const taskManager = new TaskManagerMainPage(page);

  await page.goto('http://localhost:4174/');
  await taskManager.addTask();
  await taskManager.deteleTask();
})

test('User can edit a task', async ({ page }) => {
  const taskManager = new TaskManagerMainPage(page);

  await page.goto('http://localhost:4174/');
  await taskManager.addTask();
  const newTitle = 'New Title';
  await expect(taskManager.taskCardEditButton).toBeVisible();
  await taskManager.taskCardEditButton.click()
  await expect(taskManager.taskCardEditTitle).toBeVisible();
  await taskManager.taskCardEditTitle.fill(newTitle);
  await expect(taskManager.taskCardEditTitle).toHaveText(newTitle)
  await taskManager.taskCardSaveButton.click();
  await expect(taskManager.taskCardTitle).toHaveText(newTitle);
})

test('User can filter task cards', async ({ page }) => {
  const taskManager = new TaskManagerMainPage(page);

  await page.goto('http://localhost:4174/');
  await taskManager.addMultipleTasks();
  await taskManager.filterTasks("Social");
})

test('User can mark task as complete', async ({ page }) => {
  const taskManager = new TaskManagerMainPage(page);

  await page.goto('http://localhost:4174/');
  await taskManager.addTask();
  await expect(taskManager.taskCardCompleteButton).toBeVisible();
  await taskManager.taskCardCompleteButton.click();
  await expect(taskManager.taskCardCompleteButton).toHaveText("Uncomplete") // workaround because it should be incomplete
})

test('User can sort tasks', async ({ page }) => {
  const taskManager = new TaskManagerMainPage(page);

  await page.goto('http://localhost:4174/');
  await taskManager.addMultipleTasks();
  await taskManager.sortTasks("Sort by Importance (Ascending)", "Low");
})

test('Task are still removed after page refresh', async ({ page }) => {
  const taskManager = new TaskManagerMainPage(page);

  await page.goto('http://localhost:4174/');
  await taskManager.addTask();
  await taskManager.deteleTask();
  await page.reload();
  await expect(taskManager.taskCard).toHaveCount(0);
})

test('User cannot add empty task', async ({ page }) => {
  const taskManager = new TaskManagerMainPage(page);

  await page.goto('http://localhost:4174/');
  await expect(taskManager.addTaskButton).toBeDisabled();
})

test('All cards combo', async ({ page }) => {
  const taskManager = new TaskManagerMainPage(page);

  await page.goto('http://localhost:4174/');
  await taskManager.addAllComboTasksAndMakeScreenshot()
})
