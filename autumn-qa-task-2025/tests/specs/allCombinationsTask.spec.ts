import { test } from '../fixtures/base';
import { TaskFormPage } from '../pages/TaskFormPage';
import { TaskListPage } from '../pages/TaskListPage';
import type { TaskData } from '../pages/TaskFormPage';
import { cartesian } from '../../utils/cartesian';

test.describe('Regression', () => {
  test('All task combinations with screenshots and validation', async ({ page }) => {
    const taskFormPage = new TaskFormPage(page);
    const taskListPage = new TaskListPage(page);

    await taskFormPage.expectFormVisible();

    const importances: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];
    const labels: ('Work' | 'Home' | 'Hobby' | 'Social')[] = ['Work', 'Home', 'Hobby', 'Social'];
    const completedStatuses: ('complete' | 'uncomplete')[] = ['complete', 'uncomplete'];

    const combinations = cartesian([importances, labels, completedStatuses]);

    for (const [importance, label, completed] of combinations) {
      const title = `Task ${importance}-${label}-${completed}`;
      const taskData: TaskData = {
        title,
        description: 'Combination Test',
        importance: importance as TaskData['importance'],
        label: label as TaskData['label'],
      };

      await taskListPage.addCombinationTask(taskData, completed === 'complete');
      await taskListPage.verifyNewTaskElements(taskData, completed as 'complete' | 'uncomplete');

      await taskListPage.screenshotTask(title);
    }
  });
});
