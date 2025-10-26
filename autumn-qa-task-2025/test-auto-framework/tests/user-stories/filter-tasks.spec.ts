import { test, expect } from '../../fixtures';

/**
 * User Story 5: Filter tasks by label
 * As a user, I want to filter tasks by label so that I can view tasks from specific categories
 * 
 * Acceptance Criteria:
 * - User can see filter dropdown with all label options
 * - User can select a label to filter tasks
 * - Only tasks with selected label are displayed
 * - User can select "All" to show all tasks
 * - Task count updates to reflect filtered results
 */
test.describe('User Story 5: Filter tasks by label', () => {
  
  test.beforeEach(async ({ taskManagerPage }) => {
    // Clear localStorage before each test for a clean state
    await taskManagerPage.clearLocalStorage();
  });

  test('should filter tasks by each label type @smoke', async ({ 
    taskManagerPage, 
    taskService 
  }) => {
    // Test data for each label type
    const labelTestCases: Array<{
      label: 'Work' | 'Social' | 'Home' | 'Hobby';
      expectedCount: number;
    }> = [
      { label: 'Work', expectedCount: 2 },
      { label: 'Social', expectedCount: 2 },
      { label: 'Home', expectedCount: 3 },
      { label: 'Hobby', expectedCount: 2 },
    ];

    // Arrange - Add tasks with all label types
    await taskManagerPage.addTask(taskService.createValidTask({ title: 'Work task 1', label: 'Work' }));
    await taskManagerPage.addTask(taskService.createValidTask({ title: 'Work task 2', label: 'Work' }));
    await taskManagerPage.addTask(taskService.createValidTask({ title: 'Social task 1', label: 'Social' }));
    await taskManagerPage.addTask(taskService.createValidTask({ title: 'Social task 2', label: 'Social' }));
    await taskManagerPage.addTask(taskService.createValidTask({ title: 'Home task 1', label: 'Home' }));
    await taskManagerPage.addTask(taskService.createValidTask({ title: 'Home task 2', label: 'Home' }));
    await taskManagerPage.addTask(taskService.createValidTask({ title: 'Home task 3', label: 'Home' }));
    await taskManagerPage.addTask(taskService.createValidTask({ title: 'Hobby task 1', label: 'Hobby' }));
    await taskManagerPage.addTask(taskService.createValidTask({ title: 'Hobby task 2', label: 'Hobby' }));
    
    // Verify all tasks are visible initially
    expect(await taskManagerPage.getTaskCount()).toBe(9);

    // Act & Assert - Test filtering by each label type
    for (const testCase of labelTestCases) {
      // Filter by label
      await taskManagerPage.filterByLabel(testCase.label);

      // Verify correct count
      expect(await taskManagerPage.getTaskCount()).toBe(testCase.expectedCount);

      // Verify only tasks with the selected label are visible
      for (let i = 1; i <= testCase.expectedCount; i++) {
        expect(await taskManagerPage.isTaskVisible(`${testCase.label} task ${i}`)).toBeTruthy();
      }

      // Verify tasks with other labels are hidden
      const otherLabels = labelTestCases.filter(tc => tc.label !== testCase.label);
      for (const otherLabel of otherLabels) {
        expect(await taskManagerPage.isTaskVisible(`${otherLabel.label} task 1`)).toBeFalsy();
      }
    }

    // Reset to show all tasks
    await taskManagerPage.filterByLabel('All');
    expect(await taskManagerPage.getTaskCount()).toBe(9);
  });

  test('should show all tasks when "All" label is selected', async ({ 
    taskManagerPage 
  }) => {
    // Arrange - Add tasks with different labels
    await taskManagerPage.addTask({ title: 'Work task', label: 'Work' });
    await taskManagerPage.addTask({ title: 'Social task', label: 'Social' });
    await taskManagerPage.addTask({ title: 'Home task', label: 'Home' });
    await taskManagerPage.addTask({ title: 'Hobby task', label: 'Hobby' });
    
    // Filter by Work first
    await taskManagerPage.filterByLabel('Work');
    expect(await taskManagerPage.getTaskCount()).toBe(1);

    // Act - Select "All" to show all tasks
    await taskManagerPage.filterByLabel('All');

    // Assert - All tasks should be visible
    expect(await taskManagerPage.getTaskCount()).toBe(4);
    expect(await taskManagerPage.isTaskVisible('Work task')).toBeTruthy();
    expect(await taskManagerPage.isTaskVisible('Social task')).toBeTruthy();
    expect(await taskManagerPage.isTaskVisible('Home task')).toBeTruthy();
    expect(await taskManagerPage.isTaskVisible('Hobby task')).toBeTruthy();
  });

  test('should correctly filter when no tasks match the selected label', async ({ 
    taskManagerPage 
  }) => {
    // Arrange - Add tasks only with Work and Social labels
    await taskManagerPage.addTask({ title: 'Work task 1', label: 'Work' });
    await taskManagerPage.addTask({ title: 'Work task 2', label: 'Work' });
    await taskManagerPage.addTask({ title: 'Social task', label: 'Social' });
    
    expect(await taskManagerPage.getTaskCount()).toBe(3);

    // Act - Filter by Hobby (no tasks with this label)
    await taskManagerPage.filterByLabel('Hobby');

    // Assert - No tasks should be visible
    expect(await taskManagerPage.getTaskCount()).toBe(0);
  });

  test('should filter completed and incomplete tasks correctly', async ({ 
    taskManagerPage 
  }) => {
    // Arrange - Add Work tasks, mark some as complete
    await taskManagerPage.addTask({ title: 'Work task 1', label: 'Work' });
    await taskManagerPage.addTask({ title: 'Work task 2', label: 'Work' });
    await taskManagerPage.addTask({ title: 'Social task', label: 'Social' });
    
    await taskManagerPage.toggleTaskCompletion('Work task 1');

    // Act - Filter by Work
    await taskManagerPage.filterByLabel('Work');

    // Assert - Both Work tasks should be visible (one complete, one incomplete)
    expect(await taskManagerPage.getTaskCount()).toBe(2);
    expect(await taskManagerPage.isTaskVisible('Work task 1')).toBeTruthy();
    expect(await taskManagerPage.isTaskVisible('Work task 2')).toBeTruthy();
    expect(await taskManagerPage.isTaskCompleted('Work task 1')).toBeTruthy();
    expect(await taskManagerPage.isTaskCompleted('Work task 2')).toBeFalsy();
  });

  test('should filter tasks with different importance levels', async ({ 
    taskManagerPage 
  }) => {
    // Arrange - Add Work tasks with different importance
    await taskManagerPage.addTask({ title: 'High priority work', label: 'Work', importance: 'High' });
    await taskManagerPage.addTask({ title: 'Low priority work', label: 'Work', importance: 'Low' });
    await taskManagerPage.addTask({ title: 'High priority social', label: 'Social', importance: 'High' });

    // Act - Filter by Work
    await taskManagerPage.filterByLabel('Work');

    // Assert - Both Work tasks visible regardless of importance
    expect(await taskManagerPage.getTaskCount()).toBe(2);
    expect(await taskManagerPage.isTaskVisible('High priority work')).toBeTruthy();
    expect(await taskManagerPage.isTaskVisible('Low priority work')).toBeTruthy();
    expect(await taskManagerPage.isTaskVisible('High priority social')).toBeFalsy();
  });
});

