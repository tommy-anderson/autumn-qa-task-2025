import { test, expect } from '../../fixtures';

/**
 * User Story 6: Sort tasks by importance
 * As a user, I want to sort tasks by importance so that I can prioritize my work
 * 
 * Acceptance Criteria:
 * - User can see sort dropdown with ascending/descending options
 * - User can sort tasks in ascending order (Low → Medium → High)
 * - User can sort tasks in descending order (High → Medium → Low)
 * - Sort order is maintained when adding new tasks
 * - Sort works correctly with filtered tasks
 */
test.describe('User Story 6: Sort tasks by importance', () => {
  
  test.beforeEach(async ({ taskManagerPage }) => {
    // Clear localStorage before each test for a clean state
    await taskManagerPage.clearLocalStorage();
  });

  test('should sort tasks in ascending order (Low → Medium → High) @smoke @regression', async ({ 
    taskManagerPage, 
    taskService 
  }) => {
    // Arrange - Add tasks with different importance levels
    await taskManagerPage.addTask(taskService.createValidTask({ title: 'High priority task', importance: 'High' }));
    await taskManagerPage.addTask(taskService.createValidTask({ title: 'Low priority task', importance: 'Low' }));
    await taskManagerPage.addTask(taskService.createValidTask({ title: 'Medium priority task', importance: 'Medium' }));

    // Act - Sort in ascending order
    await taskManagerPage.sortByImportance('asc');

    // Assert - Verify order: Low, Medium, High
    const tasks = await taskManagerPage.getAllTasks();
    expect(tasks.length).toBe(3);

    const firstTaskTitle = await tasks[0].locator('h3').textContent();
    const secondTaskTitle = await tasks[1].locator('h3').textContent();
    const thirdTaskTitle = await tasks[2].locator('h3').textContent();

    expect(firstTaskTitle).toBe('Low priority task');
    expect(secondTaskTitle).toBe('Medium priority task');
    expect(thirdTaskTitle).toBe('High priority task');
  });

  test('should sort tasks in descending order (High → Medium → Low)', async ({ 
    taskManagerPage 
  }) => {
    // Arrange - Add tasks with different importance levels
    await taskManagerPage.addTask({ title: 'Low priority task', importance: 'Low' });
    await taskManagerPage.addTask({ title: 'High priority task', importance: 'High' });
    await taskManagerPage.addTask({ title: 'Medium priority task', importance: 'Medium' });

    // Act - Sort in descending order
    await taskManagerPage.sortByImportance('desc');

    // Assert - Verify order: High, Medium, Low
    const tasks = await taskManagerPage.getAllTasks();
    expect(tasks.length).toBe(3);

    const firstTaskTitle = await tasks[0].locator('h3').textContent();
    const secondTaskTitle = await tasks[1].locator('h3').textContent();
    const thirdTaskTitle = await tasks[2].locator('h3').textContent();

    expect(firstTaskTitle).toBe('High priority task');
    expect(secondTaskTitle).toBe('Medium priority task');
    expect(thirdTaskTitle).toBe('Low priority task');
  });

  test('should maintain sort order when adding new tasks', async ({ 
    taskManagerPage 
  }) => {
    // Arrange - Add initial tasks and sort descending
    await taskManagerPage.addTask({ title: 'Task 1', importance: 'High' });
    await taskManagerPage.addTask({ title: 'Task 2', importance: 'Low' });
    await taskManagerPage.sortByImportance('desc');

    // Act - Add a new Medium priority task
    await taskManagerPage.addTask({ title: 'Task 3', importance: 'Medium' });

    // Assert - Verify new task is inserted in correct position
    const tasks = await taskManagerPage.getAllTasks();
    expect(tasks.length).toBe(3);

    const firstTaskTitle = await tasks[0].locator('h3').textContent();
    const secondTaskTitle = await tasks[1].locator('h3').textContent();
    const thirdTaskTitle = await tasks[2].locator('h3').textContent();

    expect(firstTaskTitle).toBe('Task 1'); // High
    expect(secondTaskTitle).toBe('Task 3'); // Medium
    expect(thirdTaskTitle).toBe('Task 2'); // Low
  });

  test('should sort multiple tasks with same importance level', async ({ 
    taskManagerPage 
  }) => {
    // Arrange - Add multiple tasks with High importance
    await taskManagerPage.addTask({ title: 'High task 1', importance: 'High' });
    await taskManagerPage.addTask({ title: 'Low task 1', importance: 'Low' });
    await taskManagerPage.addTask({ title: 'High task 2', importance: 'High' });
    await taskManagerPage.addTask({ title: 'Medium task 1', importance: 'Medium' });
    await taskManagerPage.addTask({ title: 'High task 3', importance: 'High' });

    // Act - Sort ascending
    await taskManagerPage.sortByImportance('asc');

    // Assert - Verify grouping by importance
    const tasks = await taskManagerPage.getAllTasks();
    
    // First should be Low
    const firstTaskDetails = await taskManagerPage.getTaskDetails(await tasks[0].locator('h3').textContent() || '');
    expect(firstTaskDetails?.importance).toBe('Low');

    // Second should be Medium
    const secondTaskDetails = await taskManagerPage.getTaskDetails(await tasks[1].locator('h3').textContent() || '');
    expect(secondTaskDetails?.importance).toBe('Medium');

    // Last three should be High
    for (let i = 2; i < 5; i++) {
      const taskDetails = await taskManagerPage.getTaskDetails(await tasks[i].locator('h3').textContent() || '');
      expect(taskDetails?.importance).toBe('High');
    }
  });

  test('should toggle between ascending and descending sort', async ({ 
    taskManagerPage 
  }) => {
    // Arrange - Add tasks
    await taskManagerPage.addTask({ title: 'High task', importance: 'High' });
    await taskManagerPage.addTask({ title: 'Low task', importance: 'Low' });
    await taskManagerPage.addTask({ title: 'Medium task', importance: 'Medium' });

    // Act & Assert - Sort ascending
    await taskManagerPage.sortByImportance('asc');
    let tasks = await taskManagerPage.getAllTasks();
    let firstTitle = await tasks[0].locator('h3').textContent();
    expect(firstTitle).toBe('Low task');

    // Act & Assert - Sort descending
    await taskManagerPage.sortByImportance('desc');
    tasks = await taskManagerPage.getAllTasks();
    firstTitle = await tasks[0].locator('h3').textContent();
    expect(firstTitle).toBe('High task');

    // Act & Assert - Back to ascending
    await taskManagerPage.sortByImportance('asc');
    tasks = await taskManagerPage.getAllTasks();
    firstTitle = await tasks[0].locator('h3').textContent();
    expect(firstTitle).toBe('Low task');
  });

  test('should work correctly with filtered tasks', async ({ 
    taskManagerPage 
  }) => {
    // Arrange - Add tasks with different labels and importance
    await taskManagerPage.addTask({ title: 'Work High', label: 'Work', importance: 'High' });
    await taskManagerPage.addTask({ title: 'Work Low', label: 'Work', importance: 'Low' });
    await taskManagerPage.addTask({ title: 'Social High', label: 'Social', importance: 'High' });
    await taskManagerPage.addTask({ title: 'Work Medium', label: 'Work', importance: 'Medium' });

    // Act - Filter by Work and sort descending
    await taskManagerPage.filterByLabel('Work');
    await taskManagerPage.sortByImportance('desc');

    // Assert - Only Work tasks visible, sorted by importance
    const tasks = await taskManagerPage.getAllTasks();
    expect(tasks.length).toBe(3);

    const firstTitle = await tasks[0].locator('h3').textContent();
    const secondTitle = await tasks[1].locator('h3').textContent();
    const thirdTitle = await tasks[2].locator('h3').textContent();

    expect(firstTitle).toBe('Work High');
    expect(secondTitle).toBe('Work Medium');
    expect(thirdTitle).toBe('Work Low');
  });

  test('should sort completed and incomplete tasks together', async ({ 
    taskManagerPage 
  }) => {
    // Arrange - Add tasks and mark some as complete
    await taskManagerPage.addTask({ title: 'High incomplete', importance: 'High' });
    await taskManagerPage.addTask({ title: 'Low complete', importance: 'Low' });
    await taskManagerPage.addTask({ title: 'Medium incomplete', importance: 'Medium' });
    
    await taskManagerPage.toggleTaskCompletion('Low complete');

    // Act - Sort descending
    await taskManagerPage.sortByImportance('desc');

    // Assert - All tasks sorted regardless of completion status
    const tasks = await taskManagerPage.getAllTasks();
    expect(tasks.length).toBe(3);

    const firstTitle = await tasks[0].locator('h3').textContent();
    const secondTitle = await tasks[1].locator('h3').textContent();
    const thirdTitle = await tasks[2].locator('h3').textContent();

    expect(firstTitle).toBe('High incomplete');
    expect(secondTitle).toBe('Medium incomplete');
    expect(thirdTitle).toBe('Low complete');

    // Verify completion status is preserved
    expect(await taskManagerPage.isTaskCompleted('Low complete')).toBeTruthy();
  });

  test('should maintain sort after deleting a task', async ({ 
    taskManagerPage 
  }) => {
    // Arrange - Add tasks and sort
    await taskManagerPage.addTask({ title: 'High task', importance: 'High' });
    await taskManagerPage.addTask({ title: 'Low task', importance: 'Low' });
    await taskManagerPage.addTask({ title: 'Medium task', importance: 'Medium' });
    await taskManagerPage.sortByImportance('desc');

    // Act - Delete the middle task
    await taskManagerPage.deleteTask('Medium task');

    // Assert - Remaining tasks still sorted
    const tasks = await taskManagerPage.getAllTasks();
    expect(tasks.length).toBe(2);

    const firstTitle = await tasks[0].locator('h3').textContent();
    const secondTitle = await tasks[1].locator('h3').textContent();

    expect(firstTitle).toBe('High task');
    expect(secondTitle).toBe('Low task');
  });

  test('should sort tasks with all importance levels equally represented', async ({ 
    taskManagerPage 
  }) => {
    // Arrange - Add equal number of tasks for each importance
    const tasks = [
      { title: 'High 1', importance: 'High' as const },
      { title: 'High 2', importance: 'High' as const },
      { title: 'Medium 1', importance: 'Medium' as const },
      { title: 'Medium 2', importance: 'Medium' as const },
      { title: 'Low 1', importance: 'Low' as const },
      { title: 'Low 2', importance: 'Low' as const },
    ];

    for (const task of tasks) {
      await taskManagerPage.addTask(task);
    }

    // Act - Sort ascending
    await taskManagerPage.sortByImportance('asc');

    // Assert - Verify order: all Low, then all Medium, then all High
    const displayedTasks = await taskManagerPage.getAllTasks();
    expect(displayedTasks.length).toBe(6);

    // First 2 should be Low
    for (let i = 0; i < 2; i++) {
      const title = await displayedTasks[i].locator('h3').textContent();
      const details = await taskManagerPage.getTaskDetails(title || '');
      expect(details?.importance).toBe('Low');
    }

    // Next 2 should be Medium
    for (let i = 2; i < 4; i++) {
      const title = await displayedTasks[i].locator('h3').textContent();
      const details = await taskManagerPage.getTaskDetails(title || '');
      expect(details?.importance).toBe('Medium');
    }

    // Last 2 should be High
    for (let i = 4; i < 6; i++) {
      const title = await displayedTasks[i].locator('h3').textContent();
      const details = await taskManagerPage.getTaskDetails(title || '');
      expect(details?.importance).toBe('High');
    }
  });
});



