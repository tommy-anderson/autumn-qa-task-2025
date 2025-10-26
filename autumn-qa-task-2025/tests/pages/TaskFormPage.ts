import { Page, Locator, expect } from '@playwright/test';

/**
 * Task data interface
 */
export interface TaskData {
  title: string;
  description?: string;
  importance?: 'Low' | 'Medium' | 'High';
  label?: 'Work' | 'Social' | 'Home' | 'Hobby';
}

/**
 * Page object representing the Task Form
 */
export class TaskFormPage {
  readonly page: Page;
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly importanceSelect: Locator;
  readonly labelSelect: Locator;
  readonly addButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.titleInput = page.getByRole('textbox', { name: 'Task Title' });
    this.descriptionInput = page.getByRole('textbox', { name: 'Task Description' });
    this.importanceSelect = page.getByRole('combobox').first();
    this.labelSelect = page.getByRole('combobox').nth(1);
    this.addButton = page.getByRole('button', { name: 'Add Task' });
  }

  /**
   * Ensure the form elements are visible
   */
  async expectFormVisible(): Promise<void> {
    await expect(this.titleInput).toBeVisible();
    await expect(this.descriptionInput).toBeVisible();
    await expect(this.importanceSelect).toBeVisible();
    await expect(this.labelSelect).toBeVisible();
    await expect(this.addButton).toBeVisible();
  }

  /**
   * Add a task using the form
   */
  async addTask(taskData: Partial<TaskData>): Promise<void> {
    let { title = '', description = '', importance = 'Medium', label = 'Work' } = taskData;

    try {
      // Capitalize title if provided
      if (title) {
        title = title.charAt(0).toUpperCase() + title.slice(1);
        await this.titleInput.fill(title);
      }

      if (description) {
        await this.descriptionInput.fill(description);
      }

      await this.importanceSelect.selectOption(importance);
      await this.labelSelect.selectOption(label);

      await this.addButton.click();
    } catch (err) {
      console.error('Failed to add task:', { taskData, error: err });
      throw err;
    }
  }
}
