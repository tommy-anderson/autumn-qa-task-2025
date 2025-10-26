import { test, expect } from '../../fixtures';

/**
 * User Story 1: Add a new task
 * As a user, I want to add a new task so that I can track my work
 * 
 * Acceptance Criteria:
 * - User can see the task form on the page (always visible)
 * - User can fill in task details (title is required, importance defaults to Medium)
 * - Task appears in the task list after submission
 * - Title should start with capital letter (auto-capitalized by the app)
 * - Default values: Importance = Medium, Label = Work, Completed = false
 */
test.describe('User Story 1: Add a new task', () => {
  
  test.beforeEach(async ({ taskManagerPage }) => {
    // Clear localStorage before each test for a clean state
    await taskManagerPage.clearLocalStorage();
  });

  test('should successfully add a task with all fields @smoke', async ({
    taskManagerPage, 
    taskService 
  }) => {
    // Arrange
    const task = taskService.createValidTask({
      title: 'Complete project documentation',
      description: 'Write comprehensive documentation for the project',
      importance: 'High',
      label: 'Work',
    });

    // Act
    await taskManagerPage.addTask(task);

    // Assert - Task should be visible
    // Note: The app capitalizes the first letter, so "Complete..." stays "Complete..."
    const isVisible = await taskManagerPage.isTaskVisible('Complete project documentation');
    expect(isVisible).toBeTruthy();
    
    // Verify task count increased
    const taskCount = await taskManagerPage.getTaskCount();
    expect(taskCount).toBe(1);
  });

  test('should add a task with only required fields (title)', async ({ 
    taskManagerPage, 
    taskService 
  }) => {
    // Arrange - Create task with only title (importance has default)
    const task = {
      title: 'Minimal task',
    };

    // Act
    await taskManagerPage.addTask(task);

    // Assert
    const isVisible = await taskManagerPage.isTaskVisible('Minimal task');
    expect(isVisible).toBeTruthy();
    
    // Verify default values are applied
    const taskDetails = await taskManagerPage.getTaskDetails('Minimal task');
    expect(taskDetails).not.toBeNull();
    expect(taskDetails?.importance).toBe('Medium'); // Default value
    expect(taskDetails?.label).toBe('Work'); // Default value
    expect(taskDetails?.completed).toBeFalsy();
  });

  test('should use default values when optional fields are not provided', async ({ 
    taskManagerPage 
  }) => {
    // Arrange
    const task = {
      title: 'Task with defaults',
    };

    // Act
    await taskManagerPage.addTask(task);

    // Assert
    const isVisible = await taskManagerPage.isTaskVisible('Task with defaults');
    expect(isVisible).toBeTruthy();
    
    // Verify default values are applied
    const taskDetails = await taskManagerPage.getTaskDetails('Task with defaults');
    expect(taskDetails).not.toBeNull();
    expect(taskDetails?.completed).toBeFalsy();
    expect(taskDetails?.importance).toBe('Medium');
    expect(taskDetails?.label).toBe('Work');
  });

  test('should not add task without title - negative test @regression', async ({ 
    taskManagerPage 
  }) => {
    // Arrange
    const initialCount = await taskManagerPage.getTaskCount();

    // Act - Try to submit with empty title
    await taskManagerPage.fillTaskForm({ title: '' });
    await taskManagerPage.submitTask();

    // Assert - Task should not be added
    const finalCount = await taskManagerPage.getTaskCount();
    expect(finalCount).toBe(initialCount);
  });

  test('should add multiple tasks successfully', async ({ 
    taskManagerPage, 
    taskService 
  }) => {
    // Arrange
    const tasks = [
      taskService.createValidTask({ title: 'Task 1', importance: 'High' }),
      taskService.createValidTask({ title: 'Task 2', importance: 'Medium' }),
      taskService.createValidTask({ title: 'Task 3', importance: 'Low' }),
    ];

    // Act - Add all tasks
    for (const task of tasks) {
      await taskManagerPage.addTask(task);
    }

    // Assert - All tasks should be visible
    for (const task of tasks) {
      const isVisible = await taskManagerPage.isTaskVisible(task.title);
      expect(isVisible).toBeTruthy();
    }
    
    const taskCount = await taskManagerPage.getTaskCount();
    expect(taskCount).toBe(3);
  });

  test('should persist tasks in localStorage', async ({ 
    taskManagerPage 
  }) => {
    // Arrange
    const task = {
      title: 'Persistent task',
      description: 'This should be saved',
      importance: 'High' as const,
    };

    // Act
    await taskManagerPage.addTask(task);

    // Assert - Check localStorage
    const storedTasks = await taskManagerPage.getTasksFromLocalStorage();
    expect(storedTasks.length).toBeGreaterThan(0);
    expect(storedTasks[0].title).toBe('Persistent task');
  });

  test('should test all combinations of task properties with screenshots', async ({ 
    taskManagerPage, 
    screenshotHelper,
    page
  }) => {
    // Increase timeout for this test as it performs 24 combinations with screenshots
    test.setTimeout(90000); // 90 seconds
    
    // Define all possible property values
    const importanceLevels: Array<'High' | 'Medium' | 'Low'> = ['High', 'Medium', 'Low'];
    const labels: Array<'Work' | 'Social' | 'Home' | 'Hobby'> = ['Work', 'Social', 'Home', 'Hobby'];
    const completenessStates: boolean[] = [false, true]; // false = incomplete, true = complete
    
    let combinationCount = 0;
    const totalCombinations = importanceLevels.length * labels.length * completenessStates.length;
    
    console.log(`Testing ${totalCombinations} combinations of task properties...`);

    // Generate all possible combinations
    for (const importance of importanceLevels) {
      for (const label of labels) {
        for (const completed of completenessStates) {
          combinationCount++;
          
          // Create task with current combination
          const task = {
            title: `Task ${combinationCount}`,
            description: `Combination ${combinationCount}: ${importance} ${label} ${completed ? 'Completed' : 'Incomplete'}`,
            importance,
            label,
          };

          console.log(`Testing combination ${combinationCount}/${totalCombinations}: ${importance} + ${label} + ${completed ? 'Completed' : 'Incomplete'}`);

          // Add the task
          await taskManagerPage.addTask(task);

          // If the task should be completed, toggle it
          if (completed) {
            await taskManagerPage.toggleTaskCompletion(`Task ${combinationCount}`);
          }

          // Take a screenshot after adding this combination
          await screenshotHelper.takeScreenshot(
            page,
            `combination-${combinationCount}-${importance.toLowerCase()}-${label.toLowerCase()}-${completed ? 'completed' : 'incomplete'}`
          );

          // Verify the task appears correctly
          const isVisible = await taskManagerPage.isTaskVisible(`Task ${combinationCount}`);
          expect(isVisible).toBeTruthy();

          // Verify task properties
          const taskDetails = await taskManagerPage.getTaskDetails(`Task ${combinationCount}`);
          expect(taskDetails).not.toBeNull();
          expect(taskDetails?.importance).toBe(importance);
          expect(taskDetails?.label).toBe(label);
          expect(taskDetails?.completed).toBe(completed);

          // Verify task count is 1 (only current task should be visible)
          const taskCount = await taskManagerPage.getTaskCount();
          expect(taskCount).toBe(1);

          // Clear the task before moving to next combination
          await taskManagerPage.deleteTask(`Task ${combinationCount}`);

          // Verify task is deleted
          const isDeleted = await taskManagerPage.isTaskVisible(`Task ${combinationCount}`);
          expect(isDeleted).toBeFalsy();

          // Verify task count is 0
          const finalTaskCount = await taskManagerPage.getTaskCount();
          expect(finalTaskCount).toBe(0);
        }
      }
    }

    console.log(`Successfully tested all ${totalCombinations} combinations!`);
  });
  
});

