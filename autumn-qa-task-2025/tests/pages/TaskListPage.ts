import { expect, Page } from '@playwright/test';
import { TaskItem } from './TaskItemPage';
import { TaskFormPage, type TaskData } from './TaskFormPage';

export class TaskListPage {
  constructor(private page: Page) { }

  async addCombinationTask(taskData: TaskData, completed: boolean = true): Promise<void> {
    const taskFormPage = new TaskFormPage(this.page);

    await taskFormPage.addTask(taskData);

    if (!completed) {
      const taskItem = await TaskItem.findByTitle(this.page, taskData.title ?? '');
      await taskItem.uncomplete();
      await this.page.waitForTimeout(100);
    }

    await this.verifyTaskCreated(taskData, completed);
  }

  async verifyTaskCreated(taskData: TaskData, completed: boolean) {
    const taskItem = await TaskItem.findByTitle(this.page, taskData.title ?? '');
    await taskItem.verifyNewTaskDetails(taskData, completed ? 'complete' : 'uncomplete');
  }

  async verifyNewTaskElements(
    taskData: Partial<TaskData>,
    completedStatus: 'complete' | 'uncomplete' = 'complete'
  ) {
    if (!taskData.title) throw new Error('verifyNewTaskElements requires at least a title');

    const titleLocator = this.page.locator('h3', { hasText: new RegExp(taskData.title, 'i') });
    await titleLocator.first().waitFor({ state: 'visible', timeout: 5000 });

    const taskContainer = titleLocator.first().locator('..');
    const taskItem = new TaskItem(taskContainer, this.page);

    await taskItem.expectVisible();
    const actualTitle = await titleLocator.first().innerText();
    expect(actualTitle.charAt(0)).toMatch(/[A-Z]/);
    expect(actualTitle.toLowerCase()).toContain(taskData.title.toLowerCase());

    const completeButton = taskContainer.locator('button', { hasText: /^Complete$/ });
    const uncompleteButton = taskContainer.locator('button', { hasText: /^Uncomplete$/ });

    if (completedStatus === 'complete') {
      await expect(completeButton).toBeVisible();
    } else {
      await expect(uncompleteButton).toBeVisible();
    }

    const expectedImportance = taskData.importance ?? 'Medium';
    const expectedLabel = taskData.label ?? 'Work';
    await expect(taskContainer).toContainText(`Importance: ${expectedImportance}`);
    await expect(taskContainer).toContainText(`Label: ${expectedLabel}`);
    if (taskData.description) await expect(taskContainer).toContainText(taskData.description);
  }

  static async countAllTasks(page: Page, title?: string): Promise<number> {
    const locator = title
      ? page.locator('h3', { hasText: new RegExp(`\\b${title}\\b`, 'i') })
      : page.locator('h3');
    return locator.count();
  }

  static async assertTaskCount(page: Page, expectedCount: number, title?: string): Promise<void> {
    const count = await TaskListPage.countAllTasks(page, title);
    expect(count).toBe(expectedCount);
  }

  async expectNoTasks(): Promise<void> {
    const tasks = this.page.locator('h3');
    await expect(tasks).toHaveCount(0);
  }

  async screenshotTask(title: string): Promise<void> {
    const safeTitle = title.replace(/\s+/g, '_');
    await this.page.screenshot({ path: `screenshots/${safeTitle}.png`, fullPage: true });
  }

  async filterByLabel(label: 'Work' | 'Home' | 'Hobby' | 'Social'): Promise<void> {
    const filterSelect = this.page.locator('.filter-sort select').first();
    await filterSelect.selectOption(label);
    await expect(filterSelect).toHaveValue(label);
    await this.page.waitForTimeout(100);
  }

  async sortByImportance(order: 'asc' | 'desc'): Promise<void> {
    const sortSelect = this.page.locator('.filter-sort select').nth(1);
    await sortSelect.selectOption(order);
    await expect(sortSelect).toHaveValue(order);
    await this.page.waitForTimeout(100); // allow UI to update
  }

  async getAllTaskTitles(): Promise<string[]> {
    const tasks = this.page.locator('h3');
    return tasks.allTextContents();
  }

  async verifyTaskSortAndFilter(expectedTitles: string[]): Promise<void> {
    const titles = await this.getAllTaskTitles();
    expect(titles).toEqual(expectedTitles);
  }
}
