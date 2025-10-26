import { Task } from '../pages';

/**
 * Task Service
 * 
 * This service handles task-related business logic and test data generation.
 * It provides methods for creating valid tasks, generating test combinations,
 * and validating task data according to application requirements.
 * 
 * Application Requirements:
 * - Title is required and must start with a capital letter
 * - Importance is required (defaults to 'Medium')
 * - Label is optional (defaults to 'Work')
 * - Description is optional
 * - Completed defaults to false
 * 
 * @example
 * // Create a valid task with defaults
 * const task = TaskService.createValidTask();
 * 
 * // Create a task with specific values
 * const task = TaskService.createValidTask({
 *   title: 'My Task',
 *   importance: 'High',
 *   label: 'Work'
 * });
 * 
 * // Generate all possible combinations
 * const combinations = TaskService.generateAllCombinations();
 */
export class TaskService {
  /**
   * Generate a valid task with default values
   * 
   * Creates a task that meets all application requirements.
   * Any provided overrides will be merged with the defaults.
   * 
   * @param overrides - Optional properties to override defaults
   * @returns A valid Task object
   * 
   * @example
   * const task = TaskService.createValidTask({
   *   title: 'Complete report',
   *   importance: 'High'
   * });
   */
  static createValidTask(overrides?: Partial<Task>): Task {
    return {
      title: 'Test Task',
      description: 'Test description',
      importance: 'Medium',
      label: 'Work',
      completed: false,
      ...overrides,
    };
  }

  /**
   * Generate a task with only required fields
   * 
   * Creates a minimal task with only the required title field.
   * Other fields will use application defaults.
   * 
   * @param overrides - Optional properties to override
   * @returns A minimal Task object
   * 
   * @example
   * const task = TaskService.createMinimalTask({
   *   title: 'Minimal Task'
   * });
   */
  static createMinimalTask(overrides?: Partial<Task>): Task {
    return {
      title: 'Minimal Task',
      importance: 'Medium',
      ...overrides,
    };
  }

  /**
   * Generate a task with random data
   * 
   * Creates a task with randomized properties.
   * Useful for generating varied test data.
   * 
   * @returns A Task with random properties
   * 
   * @example
   * const task = TaskService.createRandomTask();
   */
  static createRandomTask(): Task {
    const titles = [
      'Complete project documentation',
      'Review pull requests',
      'Update dependencies',
      'Fix critical bug',
      'Implement new feature',
    ];
    
    const descriptions = [
      'This is a detailed description of the task',
      'Some important notes about this task',
      'Make sure to follow the guidelines',
      '',
    ];

    const importances: Array<'High' | 'Medium' | 'Low'> = ['High', 'Medium', 'Low'];
    const labels: Array<'Work' | 'Social' | 'Home' | 'Hobby'> = ['Work', 'Social', 'Home', 'Hobby'];

    return {
      title: titles[Math.floor(Math.random() * titles.length)],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      importance: importances[Math.floor(Math.random() * importances.length)],
      label: labels[Math.floor(Math.random() * labels.length)],
      completed: Math.random() > 0.5,
    };
  }

  /**
   * Generate multiple tasks
   */
  static createMultipleTasks(count: number): Task[] {
    const tasks: Task[] = [];
    for (let i = 0; i < count; i++) {
      tasks.push(this.createValidTask({ title: `Task ${i + 1}` }));
    }
    return tasks;
  }

  /**
   * Generate all possible task combinations
   * Used for comprehensive testing
   */
  static generateAllCombinations(): Task[] {
    const importances: Array<'High' | 'Medium' | 'Low'> = ['High', 'Medium', 'Low'];
    const labels: Array<'Work' | 'Social' | 'Home' | 'Hobby'> = ['Work', 'Social', 'Home', 'Hobby'];
    const completedStates = [true, false];

    const combinations: Task[] = [];

    importances.forEach((importance) => {
      labels.forEach((label) => {
        completedStates.forEach((completed) => {
          combinations.push({
            title: `Task ${importance} ${label} ${completed ? 'Done' : 'Pending'}`,
            description: `Task with ${importance} importance, ${label} label, ${completed ? 'completed' : 'pending'}`,
            importance,
            label,
            completed,
          });
        });
      });
    });

    return combinations;
  }

  /**
   * Validate task data
   */
  static validateTask(task: Task): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Title is required
    if (!task.title || task.title.trim() === '') {
      errors.push('Title is required');
    }

    // Title should start with capital letter
    if (task.title && !/^[A-Z]/.test(task.title)) {
      errors.push('Title should start with a capital letter');
    }

    // Importance is required
    if (!task.importance) {
      errors.push('Importance is required');
    }

    // Validate importance values
    if (task.importance && !['High', 'Medium', 'Low'].includes(task.importance)) {
      errors.push('Invalid importance value');
    }

    // Validate label values
    if (task.label && !['Work', 'Social', 'Home', 'Hobby'].includes(task.label)) {
      errors.push('Invalid label value');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Create task with invalid data for negative testing
   */
  static createInvalidTask(type: 'no-title' | 'lowercase-title' | 'invalid-importance' | 'invalid-label'): Partial<Task> {
    switch (type) {
      case 'no-title':
        return {
          title: '',
          importance: 'Medium',
        };
      case 'lowercase-title':
        return {
          title: 'lowercase title',
          importance: 'Medium',
        };
      case 'invalid-importance':
        return {
          title: 'Valid Title',
          importance: 'Invalid' as any,
        };
      case 'invalid-label':
        return {
          title: 'Valid Title',
          importance: 'Medium',
          label: 'Invalid' as any,
        };
      default:
        return {};
    }
  }

  /**
   * Generate tasks for specific test scenarios
   */
  static generateTestScenarios(): Record<string, Task> {
    return {
      highPriorityWork: {
        title: 'Critical Work Task',
        description: 'This is a high priority work task',
        importance: 'High',
        label: 'Work',
        completed: false,
      },
      completedSocialTask: {
        title: 'Completed Social Event',
        description: 'Attended the social event',
        importance: 'Low',
        label: 'Social',
        completed: true,
      },
      homeHobbyTask: {
        title: 'Home Hobby Project',
        description: 'Work on home hobby project',
        importance: 'Medium',
        label: 'Hobby',
        completed: false,
      },
      minimalRequiredFields: {
        title: 'Minimal Task',
        importance: 'Medium',
      },
    };
  }
}

