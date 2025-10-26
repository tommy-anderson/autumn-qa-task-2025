import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Task interface representing a task in the application
 * Matches the structure of the React application's Task interface
 */
export interface Task {
  title: string;
  description?: string;
  importance?: 'High' | 'Medium' | 'Low';
  label?: 'Work' | 'Social' | 'Home' | 'Hobby';
  completed?: boolean;
}

/**
 * Page Object for Task Manager application
 * 
 * This class encapsulates all interactions with the Task Manager application.
 * It follows the Page Object Model (POM) design pattern to provide a clean,
 * maintainable interface for test automation.
 * 
 * Key Features:
 * - Form interactions (add tasks with validation)
 * - Task management (edit, delete, mark complete)
 * - Filtering and sorting capabilities
 * - State management through localStorage
 * 
 * @example
 * const taskManager = new TaskManagerPage(page);
 * await taskManager.navigate();
 * await taskManager.addTask({ title: 'My Task', importance: 'High' });
 */
export class TaskManagerPage extends BasePage {
  // Locators for Task Form (always visible on the page)
  private readonly titleInput: Locator;
  private readonly descriptionTextarea: Locator;
  private readonly importanceSelect: Locator;
  private readonly labelSelect: Locator;
  private readonly addTaskButton: Locator;
  
  // Locators for Task List
  private readonly taskList: Locator;
  private readonly taskItems: Locator;
  private readonly pageHeading: Locator;
  
  // Locators for Filters and Sorting
  private readonly filterByLabelSelect: Locator;
  private readonly sortByImportanceSelect: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize form locators - using placeholders since the app doesn't use labels
    this.titleInput = page.getByPlaceholder('Task Title');
    this.descriptionTextarea = page.getByPlaceholder('Task Description');
    
    // Importance and Label selects - they're in a specific layout
    // The first select is importance, second is label
    const selects = page.locator('form select');
    this.importanceSelect = selects.nth(0);
    this.labelSelect = selects.nth(1);
    
    // Submit button in the form
    this.addTaskButton = page.locator('form button[type="submit"]');
    
    // Page heading
    this.pageHeading = page.locator('h1:has-text("Task Manager")');
    
    // Task list and items
    this.taskList = page.locator('.task-list');
    this.taskItems = page.locator('.task-item');
    
    // Filter and sort controls (outside the form)
    this.filterByLabelSelect = page.locator('.filter-sort select').first();
    this.sortByImportanceSelect = page.locator('.filter-sort select').last();
  }

  /**
   * Navigate to Task Manager page
   * 
   * @throws Error if page fails to load
   * @example
   * await taskManagerPage.navigate();
   */
  async navigate(): Promise<void> {
    await this.goto('/');
    await this.waitForPageLoad();
    // Wait for the page heading to ensure the app has loaded
    await this.pageHeading.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Fill the task form with provided data
   * 
   * Note: The form is always visible on the page, no need to open it first.
   * The application automatically capitalizes the first letter of the title.
   * 
   * @param task - Task object with form data
   * @example
   * await taskManagerPage.fillTaskForm({
   *   title: 'My Task',
   *   description: 'Task details',
   *   importance: 'High',
   *   label: 'Work'
   * });
   */
  async fillTaskForm(task: Task): Promise<void> {
    // Clear and fill title field
    if (task.title !== undefined) {
      await this.titleInput.clear();
      await this.titleInput.fill(task.title);
    }
    
    // Clear and fill description field
    if (task.description !== undefined) {
      await this.descriptionTextarea.clear();
      await this.descriptionTextarea.fill(task.description);
    }
    
    // Select importance (defaults to 'Medium' if not specified)
    if (task.importance) {
      await this.importanceSelect.selectOption(task.importance);
    }
    
    // Select label (defaults to 'Work' if not specified)
    if (task.label) {
      await this.labelSelect.selectOption(task.label);
    }
  }

  /**
   * Submit the task form
   * 
   * Note: Form will only submit if title is provided (required field)
   * 
   * @example
   * await taskManagerPage.submitTask();
   */
  async submitTask(): Promise<void> {
    await this.addTaskButton.click();
    // Wait a bit for the task to be added to the list
    await this.page.waitForTimeout(500);
  }

  /**
   * Add a new task (complete flow)
   * 
   * This is a convenience method that fills the form and submits it.
   * The title will be automatically capitalized by the application.
   * 
   * @param task - Task object with form data
   * @example
   * await taskManagerPage.addTask({
   *   title: 'Complete documentation',
   *   importance: 'High',
   *   label: 'Work'
   * });
   */
  async addTask(task: Task): Promise<void> {
    await this.fillTaskForm(task);
    await this.submitTask();
  }

  /**
   * Get all tasks displayed on the page
   * 
   * @returns Array of task element locators
   * @example
   * const tasks = await taskManagerPage.getAllTasks();
   * console.log(`Found ${tasks.length} tasks`);
   */
  async getAllTasks(): Promise<Locator[]> {
    return await this.taskItems.all();
  }

  /**
   * Get count of tasks currently displayed
   * 
   * Takes into account active filters
   * 
   * @returns Number of visible tasks
   * @example
   * const count = await taskManagerPage.getTaskCount();
   */
  async getTaskCount(): Promise<number> {
    return await this.taskItems.count();
  }

  /**
   * Check if a task exists by title
   * 
   * The title should be the capitalized version as displayed in the app.
   * 
   * @param taskTitle - Title of the task to check
   * @returns True if task is visible, false otherwise
   * @example
   * const exists = await taskManagerPage.isTaskVisible('Complete documentation');
   */
  async isTaskVisible(taskTitle: string): Promise<boolean> {
    // Look for the task title in h3 elements within task items
    const task = this.page.locator(`.task-item h3:has-text("${taskTitle}")`);
    return await task.isVisible().catch(() => false);
  }

  /**
   * Get a task element by title
   * 
   * @param taskTitle - Title of the task
   * @returns Locator for the task item
   */
  private getTaskByTitle(taskTitle: string): Locator {
    return this.page.locator(`.task-item:has(h3:has-text("${taskTitle}"))`);
  }

  /**
   * Mark a task as complete/incomplete by clicking the Complete/Uncomplete button
   * 
   * @param taskTitle - Title of the task to toggle
   * @example
   * await taskManagerPage.toggleTaskCompletion('My Task');
   */
  async toggleTaskCompletion(taskTitle: string): Promise<void> {
    const taskCard = this.getTaskByTitle(taskTitle);
    const toggleButton = taskCard.locator('button').filter({ hasText: /Complete|Uncomplete/ });
    await toggleButton.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Delete a task by title
   * 
   * @param taskTitle - Title of the task to delete
   * @example
   * await taskManagerPage.deleteTask('Unwanted Task');
   */
  async deleteTask(taskTitle: string): Promise<void> {
    const taskCard = this.getTaskByTitle(taskTitle);
    const deleteButton = taskCard.locator('button:has-text("Delete")');
    await deleteButton.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Click the Edit button on a task
   * 
   * This opens the inline edit mode for the task.
   * 
   * @param taskTitle - Title of the task to edit
   * @example
   * await taskManagerPage.clickEditTask('My Task');
   */
  async clickEditTask(taskTitle: string): Promise<void> {
    const taskCard = this.getTaskByTitle(taskTitle);
    const editButton = taskCard.locator('button:has-text("Edit")');
    await editButton.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Fill the inline edit form for a task
   * 
   * Must be called after clicking the Edit button.
   * 
   * @param task - New task data
   * @example
   * await taskManagerPage.clickEditTask('Old Title');
   * await taskManagerPage.fillEditForm({ title: 'New Title', importance: 'High' });
   */
  async fillEditForm(task: Task): Promise<void> {
    // When editing, the form appears inside the task card
    if (task.title !== undefined) {
      const titleInput = this.page.locator('.task-item input[type="text"]').first();
      await titleInput.clear();
      await titleInput.fill(task.title);
    }
    
    if (task.description !== undefined) {
      const descTextarea = this.page.locator('.task-item textarea').first();
      await descTextarea.clear();
      await descTextarea.fill(task.description);
    }
    
    if (task.importance) {
      const importanceSelect = this.page.locator('.task-item select').first();
      await importanceSelect.selectOption(task.importance);
    }
    
    if (task.label) {
      const labelSelect = this.page.locator('.task-item select').nth(1);
      await labelSelect.selectOption(task.label);
    }
  }

  /**
   * Save the edited task by clicking the Save button
   * 
   * @example
   * await taskManagerPage.saveEditedTask();
   */
  async saveEditedTask(): Promise<void> {
    const saveButton = this.page.locator('.task-item button:has-text("Save")').first();
    await saveButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Cancel editing a task
   * 
   * @example
   * await taskManagerPage.cancelEditTask();
   */
  async cancelEditTask(): Promise<void> {
    const cancelButton = this.page.locator('.task-item button:has-text("Cancel")').first();
    await cancelButton.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Edit a task (complete flow)
   * 
   * Opens edit mode, fills the form, and saves.
   * 
   * @param oldTitle - Current title of the task
   * @param newTask - New task data
   * @example
   * await taskManagerPage.editTask('Old Title', {
   *   title: 'New Title',
   *   importance: 'High'
   * });
   */
  async editTask(oldTitle: string, newTask: Task): Promise<void> {
    await this.clickEditTask(oldTitle);
    await this.fillEditForm(newTask);
    await this.saveEditedTask();
  }

  /**
   * Filter tasks by label
   * 
   * Uses the filter dropdown at the top of the page.
   * 
   * @param label - Label to filter by ('All' shows all tasks)
   * @example
   * await taskManagerPage.filterByLabel('Work');
   */
  async filterByLabel(label: 'All' | 'Work' | 'Social' | 'Home' | 'Hobby'): Promise<void> {
    await this.filterByLabelSelect.selectOption(label);
    await this.page.waitForTimeout(300);
  }

  /**
   * Sort tasks by importance
   * 
   * Uses the sort dropdown at the top of the page.
   * 
   * @param order - 'asc' for Low->High, 'desc' for High->Low
   * @example
   * await taskManagerPage.sortByImportance('desc');
   */
  async sortByImportance(order: 'asc' | 'desc' = 'asc'): Promise<void> {
    await this.sortByImportanceSelect.selectOption(order);
    await this.page.waitForTimeout(300);
  }

  /**
   * Get task details by title
   * 
   * Extracts all visible information about a task.
   * 
   * @param taskTitle - Title of the task
   * @returns Object with task details or null if task not found
   * @example
   * const details = await taskManagerPage.getTaskDetails('My Task');
   * console.log(details.importance); // 'High'
   */
  async getTaskDetails(taskTitle: string): Promise<{ 
    title: string; 
    description: string; 
    importance: string; 
    label: string; 
    completed: boolean;
  } | null> {
    const taskCard = this.getTaskByTitle(taskTitle);
    
    if (!await taskCard.isVisible().catch(() => false)) {
      return null;
    }

    const title = await taskCard.locator('h3').textContent() || '';
    
    // Description is in a <p> with class "text-sm"
    const description = await taskCard.locator('p.text-sm').textContent().catch(() => '') || '';
    
    // Importance is in a <p> with text "Importance: "
    const importanceText = await taskCard.locator('p:has-text("Importance:")').textContent() || '';
    const importance = importanceText.replace('Importance: ', '').trim();
    
    // Label is in a <p> with text "Label: "
    const labelText = await taskCard.locator('p:has-text("Label:")').textContent() || '';
    const label = labelText.replace('Label: ', '').trim();
    
    // Check if the task card has the completed background color
    const classList = await taskCard.getAttribute('class') || '';
    const completed = classList.includes('bg-green-200');

    return { title, description, importance, label, completed };
  }

  /**
   * Check if add task form is visible
   * 
   * The form is always visible in this application.
   * 
   * @returns True (form is always visible)
   * @example
   * const isVisible = await taskManagerPage.isAddTaskFormVisible();
   */
  async isAddTaskFormVisible(): Promise<boolean> {
    return await this.titleInput.isVisible().catch(() => false);
  }

  /**
   * Check if the submit button is enabled
   * 
   * Button may be disabled if title is empty.
   * 
   * @returns True if button is enabled
   * @example
   * const canSubmit = await taskManagerPage.isSubmitButtonEnabled();
   */
  async isSubmitButtonEnabled(): Promise<boolean> {
    return await this.addTaskButton.isEnabled();
  }

  /**
   * Clear all form fields
   * 
   * Resets the form to its default state.
   * 
   * @example
   * await taskManagerPage.clearForm();
   */
  async clearForm(): Promise<void> {
    await this.titleInput.clear();
    await this.descriptionTextarea.clear();
    await this.importanceSelect.selectOption('Medium');
    await this.labelSelect.selectOption('Work');
  }

  /**
   * Clear all tasks (helper method for test cleanup)
   * 
   * Deletes all tasks one by one.
   * 
   * @example
   * await taskManagerPage.clearAllTasks();
   */
  async clearAllTasks(): Promise<void> {
    let tasks = await this.getAllTasks();
    
    while (tasks.length > 0) {
      const firstTask = tasks[0];
      const title = await firstTask.locator('h3').textContent() || '';
      if (title) {
        await this.deleteTask(title);
      }
      // Get updated task list
      tasks = await this.getAllTasks();
    }
  }

  /**
   * Clear localStorage (reset app state)
   * 
   * Removes all tasks from localStorage and reloads the page.
   * This is faster than deleting tasks one by one.
   * 
   * @example
   * await taskManagerPage.clearLocalStorage();
   */
  async clearLocalStorage(): Promise<void> {
    await this.page.evaluate(() => {
      localStorage.clear();
    });
    await this.page.reload();
    await this.waitForPageLoad();
  }

  /**
   * Get tasks from localStorage
   * 
   * Directly reads the tasks array from browser storage.
   * 
   * @returns Array of tasks stored in localStorage
   * @example
   * const storedTasks = await taskManagerPage.getTasksFromLocalStorage();
   */
  async getTasksFromLocalStorage(): Promise<Task[]> {
    const tasks = await this.page.evaluate(() => {
      const stored = localStorage.getItem('tasks');
      return stored ? JSON.parse(stored) : [];
    });
    return tasks;
  }

  /**
   * Check if a task is marked as completed (by visual appearance)
   * 
   * @param taskTitle - Title of the task
   * @returns True if task has completed styling
   * @example
   * const isCompleted = await taskManagerPage.isTaskCompleted('My Task');
   */
  async isTaskCompleted(taskTitle: string): Promise<boolean> {
    const taskCard = this.getTaskByTitle(taskTitle);
    const classList = await taskCard.getAttribute('class') || '';
    return classList.includes('bg-green-200');
  }

  /**
   * Get the text of the Complete/Uncomplete button for a task
   * 
   * Useful for verifying button state.
   * 
   * @param taskTitle - Title of the task
   * @returns Button text ('Complete' or 'Uncomplete')
   * @example
   * const buttonText = await taskManagerPage.getCompleteButtonText('My Task');
   */
  async getCompleteButtonText(taskTitle: string): Promise<string> {
    const taskCard = this.getTaskByTitle(taskTitle);
    const button = taskCard.locator('button').filter({ hasText: /Complete|Uncomplete/ });
    return await button.textContent() || '';
  }

  /**
   * Wait for a specific number of tasks to be displayed
   * 
   * Useful for waiting for tasks to load or for UI updates.
   * 
   * @param count - Expected number of tasks
   * @param timeout - Maximum time to wait in milliseconds
   * @example
   * await taskManagerPage.waitForTaskCount(5, 3000);
   */
  async waitForTaskCount(count: number, timeout: number = 5000): Promise<void> {
    await this.page.waitForFunction(
      (expectedCount) => {
        const items = document.querySelectorAll('.task-item');
        return items.length === expectedCount;
      },
      count,
      { timeout }
    );
  }
}

