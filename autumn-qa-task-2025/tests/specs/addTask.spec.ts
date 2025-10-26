import { test } from '../fixtures/base';
import { TaskFormPage } from '../pages/TaskFormPage';
import { TaskListPage } from '../pages/TaskListPage';

test.describe('Smoke', () => {

    test('Create and verify a new task with all fields completed', async ({ page }) => {
        const taskFormPage = new TaskFormPage(page);
        const taskListPage = new TaskListPage(page);
        const taskData = {
            title: 'Read a book',
            description: 'Finish Playwright guide',
            importance: 'High',
            label: 'Hobby',
        } as const;
        await taskFormPage.expectFormVisible();
        await taskFormPage.addTask(taskData);
        await taskListPage.verifyNewTaskElements(taskData, 'complete');
    });
});

test.describe('Regression', () => {
    test('Add task with only required fields (title + importance)', async ({ page }) => {
        const taskFormPage = new TaskFormPage(page);
        const taskListPage = new TaskListPage(page);
        const taskData = {
            title: 'work meeting',
            importance: 'Low',
        } as const;
        await taskFormPage.expectFormVisible();
        await taskFormPage.addTask(taskData);
        await taskListPage.verifyNewTaskElements(taskData);
    });

    test('Add Task with Default Values', async ({ page }) => {
        const taskFormPage = new TaskFormPage(page);
        const taskListPage = new TaskListPage(page);
        const taskData = { title: 'Fast created task' };
        await taskFormPage.addTask(taskData);
        await taskListPage.verifyNewTaskElements(taskData);
    });

    test('Add Task without required fields', async ({ page }) => {
        const taskFormPage = new TaskFormPage(page);
        const taskListPage = new TaskListPage(page);
        const taskData = { description: 'No title' };
        /* Bug 3 – Title is Optional */
        await taskListPage.expectNoTasks();
    });
});
