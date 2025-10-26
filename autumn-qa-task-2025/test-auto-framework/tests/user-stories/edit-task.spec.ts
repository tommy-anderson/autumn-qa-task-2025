import { test, expect } from '../../fixtures';

/**
 * User Story 3: Edit a task
 * As a user, I want to edit a task so that I can update task details
 * 
 * Acceptance Criteria:
 * - User can click Edit button on a task card
 * - Inline edit form appears with current values
 * - User can modify task details (title, description, importance, label)
 * - User can save changes or cancel editing
 * - Changes are reflected in the task list and localStorage
 */
test.describe('User Story 3: Edit a task', () => {
  
  test.beforeEach(async ({ taskManagerPage }) => {
    // Clear localStorage before each test for a clean state
    await taskManagerPage.clearLocalStorage();
  });

  test('should successfully edit a task @smoke', async ({
    taskManagerPage, 
    taskService 
  }) => {
    // Arrange - Add a task first
    const originalTask = taskService.createValidTask({
      title: 'Original Task Title',
      description: 'Original description',
      importance: 'Low',
      label: 'Home',
    });
    await taskManagerPage.addTask(originalTask);
    
    // Verify original task is visible
    expect(await taskManagerPage.isTaskVisible('Original Task Title')).toBeTruthy();

    // Act - Edit the task
    const updatedTask = taskService.createValidTask({
      title: 'Updated Task Title',
      description: 'Updated description',
      importance: 'High',
      label: 'Work',
    });
    await taskManagerPage.editTask('Original Task Title', updatedTask);

    // Assert - Updated task should be visible
    const isVisible = await taskManagerPage.isTaskVisible('Updated Task Title');
    expect(isVisible).toBeTruthy();
    
    // Original task should not be visible
    const originalVisible = await taskManagerPage.isTaskVisible('Original Task Title');
    expect(originalVisible).toBeFalsy();
    
    // Verify updated details
    const taskDetails = await taskManagerPage.getTaskDetails('Updated Task Title');
    expect(taskDetails?.importance).toBe('High');
    expect(taskDetails?.label).toBe('Work');
  });

  test('should edit only task title', async ({ 
    taskManagerPage, 
    taskService 
  }) => {
    // Arrange
    const originalTask = taskService.createValidTask({
      title: 'Title to Change',
      description: 'Keep this description',
      importance: 'Medium',
    });
    await taskManagerPage.addTask(originalTask);

    // Act - Edit only the title
    const updatedTask = {
      title: 'Changed Title',
    };
    await taskManagerPage.editTask('Title to Change', updatedTask as any);

    // Assert
    const isVisible = await taskManagerPage.isTaskVisible('Changed Title');
    expect(isVisible).toBeTruthy();
    
    // Verify the task exists
    const taskDetails = await taskManagerPage.getTaskDetails('Changed Title');
    expect(taskDetails).not.toBeNull();
  });

  test('should edit task importance level', async ({ 
    taskManagerPage, 
    taskService 
  }) => {
    // Arrange
    const task = taskService.createValidTask({
      title: 'Task with changing importance',
      importance: 'Low',
    });
    await taskManagerPage.addTask(task);

    // Act - Change importance
    await taskManagerPage.editTask('Task with changing importance', {
      title: 'Task with changing importance',
      importance: 'High',
    } as any);

    // Assert - Verify importance changed
    const taskDetails = await taskManagerPage.getTaskDetails('Task with changing importance');
    expect(taskDetails?.importance).toBe('High');
  });

  test('should edit task label', async ({ 
    taskManagerPage 
  }) => {
    // Arrange
    await taskManagerPage.addTask({
      title: 'Task with changing label',
      label: 'Work',
    });

    // Act - Change label
    await taskManagerPage.editTask('Task with changing label', {
      title: 'Task with changing label',
      label: 'Hobby',
    } as any);

    // Assert - Verify label changed
    const taskDetails = await taskManagerPage.getTaskDetails('Task with changing label');
    expect(taskDetails?.label).toBe('Hobby');
  });

  test('should edit task description', async ({ 
    taskManagerPage 
  }) => {
    // Arrange
    await taskManagerPage.addTask({
      title: 'Task with description',
      description: 'Original description',
    });

    // Act - Change description
    await taskManagerPage.editTask('Task with description', {
      title: 'Task with description',
      description: 'New description',
    } as any);

    // Assert - Verify description changed
    const taskDetails = await taskManagerPage.getTaskDetails('Task with description');
    expect(taskDetails?.description).toBe('New description');
  });

  test('should cancel task editing', async ({ 
    taskManagerPage 
  }) => {
    // Arrange
    await taskManagerPage.addTask({
      title: 'Task to cancel edit',
      importance: 'High',
    });

    // Act - Start editing but cancel
    await taskManagerPage.clickEditTask('Task to cancel edit');
    await taskManagerPage.fillEditForm({
      title: 'This should not be saved',
    });
    await taskManagerPage.cancelEditTask();

    // Assert - Original task should still be there
    const isVisible = await taskManagerPage.isTaskVisible('Task to cancel edit');
    expect(isVisible).toBeTruthy();
    
    // Changed title should not exist
    const changedVisible = await taskManagerPage.isTaskVisible('This should not be saved');
    expect(changedVisible).toBeFalsy();
  });

  test('should edit a completed task', async ({ 
    taskManagerPage 
  }) => {
    // Arrange - Add and complete a task
    await taskManagerPage.addTask({ title: 'Completed task' });
    await taskManagerPage.toggleTaskCompletion('Completed task');
    
    // Verify it's completed
    expect(await taskManagerPage.isTaskCompleted('Completed task')).toBeTruthy();

    // Act - Edit the completed task
    await taskManagerPage.editTask('Completed task', {
      title: 'Edited completed task',
    } as any);

    // Assert - Task should be edited
    expect(await taskManagerPage.isTaskVisible('Edited completed task')).toBeTruthy();
  });

  test('should update localStorage after editing @regression', async ({ 
    taskManagerPage 
  }) => {
    // Arrange - Add a task
    await taskManagerPage.addTask({
      title: 'Task in storage',
      importance: 'Low',
    });

    // Act - Edit the task
    await taskManagerPage.editTask('Task in storage', {
      title: 'Updated task in storage',
      importance: 'High',
    } as any);

    // Assert - Check localStorage for updated values
    const storedTasks = await taskManagerPage.getTasksFromLocalStorage();
    const updatedTask = storedTasks.find(t => t.title === 'Updated task in storage');
    expect(updatedTask).toBeDefined();
    expect(updatedTask?.importance).toBe('High');
  });
});

