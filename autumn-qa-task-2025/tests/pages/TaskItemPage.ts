import { Locator, expect, Page } from '@playwright/test';
import type { TaskData } from './TaskFormPage';
import { TaskListPage } from '../pages/TaskListPage';

export class TaskItem {
  constructor(private root: Locator, private page: Page) { }

  static async findByTitle(page: Page, title: string): Promise<TaskItem> {
    const titleLocator = page.locator('h3', { hasText: new RegExp(title, 'i') });
    await titleLocator.first().waitFor({ state: 'visible', timeout: 5000 });
    const taskContainer = titleLocator.first().locator('..');
    return new TaskItem(taskContainer, page);
  }

  static async deleteTask(page: Page, title: string): Promise<void> {
    console.log(`🗑️ Attempting to delete task with title: "${title}"`);

    const titleLocator = page.locator('h3', { hasText: new RegExp(`\\b${title}\\b`, 'i') });
    await titleLocator.first().waitFor({ state: 'visible', timeout: 5000 });

    const taskContainer = titleLocator.first().locator('..');
    const deleteButton = taskContainer.locator('button', { hasText: 'Delete' });

    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    await page.waitForTimeout(200);

    const deletedTaskLocator = page.locator('h3', { hasText: new RegExp(`\\b${title}\\b`, 'i') });
    await expect(deletedTaskLocator).toHaveCount(0, { timeout: 5000 });

    console.log(`✅ Task "${title}" successfully deleted.`);
  }

  async deleteTask(title: string): Promise<void> {
    const deleteButton = this.root.locator('button', { hasText: 'Delete' });
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    await this.page.waitForTimeout(200);

    const deletedTaskLocator = this.page.locator('h3', { hasText: new RegExp(`\\b${title}\\b`, 'i') });
    await expect(deletedTaskLocator).toHaveCount(0, { timeout: 5000 });
  }

  static async expectTaskNotPresent(page: Page, title: string): Promise<void> {
    const taskLocator = page.locator('h3', { hasText: new RegExp(`\\b${title}\\b`, 'i') });
    await expect(taskLocator).toHaveCount(0, { timeout: 5000 });
  }

  async complete(): Promise<void> {
    const btn = this.root.locator('button', { hasText: 'Complete' });
    await expect(btn).toBeVisible();
    await btn.click();
  }

  async uncomplete(): Promise<void> {
    /* Modify this once Bug 12 – Incomplete Button UX and Text is fixed */
    const completeButton = this.root.locator('button', { hasText: /^Complete$/ });
    if (await completeButton.isVisible()) {
      await completeButton.click();
    }
    await this.page.waitForTimeout(100);
  }

  async edit(): Promise<void> {
    const btn = this.root.locator('button', { hasText: 'Edit' });
    await expect(btn).toBeVisible();
    await btn.click();
  }

  /* to be modified after redesign/refactor of the button */
  async cancel(): Promise<void> {
    await expect(this.page.locator('#root')).toContainText('Cancel');
    await this.page.getByRole('button', { name: 'Cancel' }).click();
  }

  async editTask(newData: TaskData, clickEdit: boolean = true): Promise<void> {
    if (clickEdit) {
      await this.edit();
    }

    const titleInput = this.page.getByRole('textbox', { name: 'Title', exact: true });
    const descriptionInput = this.page.getByRole('textbox', { name: 'Description', exact: true });
    const importanceSelect = this.page.getByRole('combobox').nth(4);
    const labelSelect = this.page.getByRole('combobox').nth(5);
    const saveButton = this.page.getByRole('button', { name: 'Save' });

    await expect(titleInput).toBeVisible();
    await expect(descriptionInput).toBeVisible();
    await expect(importanceSelect).toBeVisible();
    await expect(labelSelect).toBeVisible();

    if (newData.title) await titleInput.fill(newData.title);
    if ('description' in newData) await descriptionInput.fill(newData.description ?? '');
    if (newData.importance) await importanceSelect.selectOption(newData.importance);
    if (newData.label) await labelSelect.selectOption(newData.label);
    await saveButton.click();
  }

  async verifyEditFormPrefill(expectedData: TaskData): Promise<void> {
    const titleInput = this.page.getByRole('textbox', { name: 'Title', exact: true });
    const descriptionInput = this.page.getByRole('textbox', { name: 'Description', exact: true });
    const importanceSelect = this.page.getByRole('combobox').nth(4);
    const labelSelect = this.page.getByRole('combobox').nth(5);

    await expect(titleInput).toBeVisible();
    await expect(descriptionInput).toBeVisible();
    await expect(importanceSelect).toBeVisible();
    await expect(labelSelect).toBeVisible();

    if (expectedData.title) {
      const actualTitle = await titleInput.inputValue();
      expect(actualTitle.toLowerCase()).toContain(expectedData.title.toLowerCase());
    }

    if (expectedData.description !== undefined) {
      if (expectedData.description === '') {
        await expect(descriptionInput).toBeEmpty();
      } else {
        const actualDescription = await descriptionInput.inputValue();
        expect(actualDescription).toContain(expectedData.description);
      }
    }

    if (expectedData.importance) {
      const actualImportance = await importanceSelect.inputValue();
      expect(actualImportance).toBe(expectedData.importance);
    }

    if (expectedData.label) {
      const actualLabel = await labelSelect.inputValue();
      expect(actualLabel).toBe(expectedData.label);
    }
  }

  async expectVisible(): Promise<void> {
    await expect(this.root).toBeVisible();
    await expect(this.root.getByRole('heading')).toBeVisible();
    await expect(this.root.getByRole('button', { name: 'Complete' })).toBeVisible();
    await expect(this.root.getByRole('button', { name: 'Delete' })).toBeVisible();
    await expect(this.root.getByRole('button', { name: 'Edit' })).toBeVisible();
  }

  async verifyNewTaskDetails(
    taskData: TaskData,
    completedStatus: 'complete' | 'uncomplete' = 'complete'
  ): Promise<void> {
    if (taskData.title) {
      const titleLocator = this.root.locator('h3');
      await expect(titleLocator).toHaveText(new RegExp(taskData.title, 'i'));

      const titleText = await titleLocator.innerText();
      expect(titleText.charAt(0)).toMatch(/[A-Z]/);
    }

    if (taskData.description) {
      await expect(this.root).toContainText(taskData.description);
    }

    if (taskData.importance) {
      await expect(this.root).toContainText(`Importance: ${taskData.importance}`);
    }

    if (taskData.label) {
      await expect(this.root).toContainText(`Label: ${taskData.label}`);
    }

    const completeButton = this.root.locator('button', { hasText: 'Complete' });
    const uncompleteButton = this.root.locator('button', { hasText: 'Uncomplete' });
    if (completedStatus === 'complete') {
      await expect(completeButton).toBeVisible();
    } else {
      await expect(uncompleteButton).toBeVisible();
    }
  }

  static async deleteByTitle(page: Page, title: string): Promise<void> {
    const taskItem = await TaskItem.findByTitle(page, title);
    const deleteButton = taskItem.root.locator('button', { hasText: 'Delete' });
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    await page.waitForTimeout(200);

    await TaskListPage.assertTaskCount(page, 0, title);
  }

  async setCompleted(completed: boolean): Promise<void> {
    const completeButton = this.root.getByRole('button', { name: 'Complete' });
    const uncompleteButton = this.root.getByRole('button', { name: 'Uncomplete' });

    if (completed) {
      if (await uncompleteButton.isVisible()) {
        await uncompleteButton.click();
      }
    } else {
      if (await completeButton.isVisible()) {
        await completeButton.click();
      }
    }
    await this.page.waitForTimeout(100);
  }

  async setCompletion(status: 'complete' | 'uncomplete'): Promise<void> {
    await this.setCompleted(status === 'complete');
  }

  async verifyTaskDetails(taskData: TaskData, completed: boolean): Promise<void> {
    const titleLocator = this.root.locator('h3');
    if (taskData.title) {
      await expect(titleLocator).toHaveText(new RegExp(taskData.title, 'i'));
    }

    if (taskData.description) {
      await expect(this.root).toContainText(taskData.description);
    }

    if (taskData.importance) {
      await expect(this.root).toContainText(`Importance: ${taskData.importance}`);
    }

    if (taskData.label) {
      await expect(this.root).toContainText(`Label: ${taskData.label}`);
    }

    const completeButton = this.root.locator('button', { hasText: 'Complete' });
    const uncompleteButton = this.root.locator('button', { hasText: 'Uncomplete' });
    if (completed) {
      await expect(completeButton).toBeHidden();
      await expect(uncompleteButton).toBeVisible();
    } else {
      await expect(completeButton).toBeVisible();
      await expect(uncompleteButton).toBeHidden();
    }
  }
}
