import { Page } from '@playwright/test';
import { TaskManagerPage, Task } from '../pages';

/**
 * Test Data Service
 * Manages test data setup, cleanup, and state management
 */
export class TestDataService {
  private page: Page;
  private taskManagerPage: TaskManagerPage;

  constructor(page: Page) {
    this.page = page;
    this.taskManagerPage = new TaskManagerPage(page);
  }

  /**
   * Setup initial test data
   */
  async setupTestData(tasks: Task[]): Promise<void> {
    await this.taskManagerPage.navigate();
    
    for (const task of tasks) {
      await this.taskManagerPage.addTask(task);
    }
  }

  /**
   * Clear all test data
   */
  async clearTestData(): Promise<void> {
    await this.taskManagerPage.clearAllTasks();
  }

  /**
   * Reset application state
   */
  async resetState(): Promise<void> {
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await this.page.reload();
  }

  /**
   * Get application state from local storage
   */
  async getStoredTasks(): Promise<Task[]> {
    const tasks = await this.page.evaluate(() => {
      const stored = localStorage.getItem('tasks');
      return stored ? JSON.parse(stored) : [];
    });
    return tasks;
  }

  /**
   * Set tasks directly in local storage (for faster test setup)
   */
  async setStoredTasks(tasks: Task[]): Promise<void> {
    await this.page.evaluate((tasksToStore) => {
      localStorage.setItem('tasks', JSON.stringify(tasksToStore));
    }, tasks);
    await this.page.reload();
  }

  /**
   * Get current page URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Wait for tasks to load
   */
  async waitForTasksToLoad(): Promise<void> {
    await this.page.waitForSelector('[data-testid="task-list"]', { timeout: 5000 })
      .catch(() => this.page.waitForTimeout(1000));
  }
}

