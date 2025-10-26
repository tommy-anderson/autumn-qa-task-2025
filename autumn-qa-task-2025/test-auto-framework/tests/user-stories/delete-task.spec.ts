import { test, expect } from '../../fixtures';

/**
 * User Story 2: Delete a task
 * As a user, I want to delete a task so that I can remove completed or unwanted tasks
 * 
 * Acceptance Criteria:
 * - User can click delete button on a task card
 * - Task is removed from the list immediately
 * - Task is removed from localStorage
 * - No confirmation dialog is shown
 */
test.describe('User Story 2: Delete a task', () => {
  
  test.beforeEach(async ({ taskManagerPage }) => {
    // Clear localStorage before each test for a clean state
    await taskManagerPage.clearLocalStorage();
  });

  test('should successfully delete a task @smoke', async ({
    taskManagerPage, 
    taskService 
  }) => {
    // Arrange - Add a task first
    const task = taskService.createValidTask({
      title: 'Task to be deleted',
    });
    await taskManagerPage.addTask(task);
    
    // Verify task exists
    let isVisible = await taskManagerPage.isTaskVisible('Task to be deleted');
    expect(isVisible).toBeTruthy();
    expect(await taskManagerPage.getTaskCount()).toBe(1);

    // Act - Delete the task
    await taskManagerPage.deleteTask('Task to be deleted');

    // Assert - Task should no longer be visible
    isVisible = await taskManagerPage.isTaskVisible('Task to be deleted');
    expect(isVisible).toBeFalsy();
    expect(await taskManagerPage.getTaskCount()).toBe(0);
  });

  test('should delete multiple tasks', async ({ 
    taskManagerPage, 
    taskService 
  }) => {
    // Arrange - Add multiple tasks
    const tasks = [
      taskService.createValidTask({ title: 'Task 1 to delete' }),
      taskService.createValidTask({ title: 'Task 2 to delete' }),
      taskService.createValidTask({ title: 'Task 3 to delete' }),
    ];

    for (const task of tasks) {
      await taskManagerPage.addTask(task);
    }
    
    expect(await taskManagerPage.getTaskCount()).toBe(3);

    // Act - Delete all tasks
    for (const task of tasks) {
      await taskManagerPage.deleteTask(task.title);
    }

    // Assert - All tasks should be deleted
    for (const task of tasks) {
      const isVisible = await taskManagerPage.isTaskVisible(task.title);
      expect(isVisible).toBeFalsy();
    }
    
    expect(await taskManagerPage.getTaskCount()).toBe(0);
  });

  test('should update task count after deletion', async ({ 
    taskManagerPage, 
    taskService 
  }) => {
    // Arrange - Add tasks
    const task1 = taskService.createValidTask({ title: 'Task 1' });
    const task2 = taskService.createValidTask({ title: 'Task 2' });
    
    await taskManagerPage.addTask(task1);
    await taskManagerPage.addTask(task2);
    
    const initialCount = await taskManagerPage.getTaskCount();
    expect(initialCount).toBe(2);

    // Act - Delete one task
    await taskManagerPage.deleteTask('Task 1');

    // Assert - Count should decrease by 1
    const finalCount = await taskManagerPage.getTaskCount();
    expect(finalCount).toBe(1);
    
    // Verify the remaining task is still there
    const task2Visible = await taskManagerPage.isTaskVisible('Task 2');
    expect(task2Visible).toBeTruthy();
  });

  test('should delete a completed task', async ({ 
    taskManagerPage, 
    taskService 
  }) => {
    // Arrange - Add a task and mark it as complete
    const task = taskService.createValidTask({ title: 'Completed task to delete' });
    await taskManagerPage.addTask(task);
    await taskManagerPage.toggleTaskCompletion('Completed task to delete');
    
    // Verify it's marked as completed
    const isCompleted = await taskManagerPage.isTaskCompleted('Completed task to delete');
    expect(isCompleted).toBeTruthy();

    // Act - Delete the completed task
    await taskManagerPage.deleteTask('Completed task to delete');

    // Assert - Task should be deleted
    const isVisible = await taskManagerPage.isTaskVisible('Completed task to delete');
    expect(isVisible).toBeFalsy();
  });

  test('should remove task from localStorage after deletion @regression', async ({ 
    taskManagerPage 
  }) => {
    // Arrange - Add a task
    await taskManagerPage.addTask({
      title: 'Task in storage',
      importance: 'High',
    });
    
    // Verify it's in localStorage
    let storedTasks = await taskManagerPage.getTasksFromLocalStorage();
    expect(storedTasks.length).toBe(1);

    // Act - Delete the task
    await taskManagerPage.deleteTask('Task in storage');

    // Assert - Should be removed from localStorage
    storedTasks = await taskManagerPage.getTasksFromLocalStorage();
    expect(storedTasks.length).toBe(0);
  });
});

