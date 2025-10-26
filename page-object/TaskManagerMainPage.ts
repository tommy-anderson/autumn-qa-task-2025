import { expect, type Locator, type Page } from '@playwright/test';
import { Label, SortParam } from '../Types/Types';
import { Importance } from '../Types/Types';

export class TaskManagerMainPage {

    // Task Manager page elements
    readonly addTaskButton: Locator;
    readonly filterDropdown: Locator;
    readonly page: Page;
    readonly sortingDropdown: Locator;
    readonly taskDescription: Locator;
    readonly taskImportanceDropdown: Locator;
    readonly taskLabelDropdown: Locator;
    readonly taskTitle: Locator;

    // Task Card Component 
    readonly tasckCardLabelDropdown: Locator;
    readonly taskCard: Locator;
    readonly taskCardCancelButton: Locator;
    readonly taskCardCompleteButton: Locator;
    readonly taskCardDeleteButton: Locator;
    readonly taskCardDescription: Locator;
    readonly taskCardEditButton: Locator;
    readonly taskCardEditDescription: Locator;
    readonly taskCardEditTitle: Locator;
    readonly taskCardImportance: Locator;
    readonly taskCardImportanceDropdown: Locator;
    readonly taskCardLabel: Locator;
    readonly taskCardSaveButton: Locator;
    readonly taskCardTitle: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addTaskButton = page.getByTestId('add-task');
        this.filterDropdown = page.getByTestId('filter-dropdown');
        this.sortingDropdown = page.getByTestId('sorting-dropdown');
        this.tasckCardLabelDropdown = page.getByTestId('task-card-label-dropdown');
        this.taskCard = page.getByTestId('task-card');
        this.taskCardCancelButton = page.getByTestId('cancel-button');
        this.taskCardCompleteButton = page.getByTestId('complete-button');
        this.taskCardDeleteButton = page.getByTestId('delete-button');
        this.taskCardDescription = page.getByTestId('taskCardDescription');
        this.taskCardEditButton = page.getByTestId('edit-button');
        this.taskCardEditDescription = page.getByTestId('task-card-description');
        this.taskCardEditTitle = page.getByTestId('task-card-title');
        this.taskCardImportance = page.getByTestId('task-card-importance');
        this.taskCardImportanceDropdown = page.getByTestId('task-card-importance-dropdown');
        this.taskCardLabel = page.getByTestId('task-card-label');
        this.taskCardSaveButton = page.getByTestId('save-button');
        this.taskCardTitle = page.getByTestId('taskCardTitle');
        this.taskDescription = page.getByTestId('description-box');
        this.taskImportanceDropdown = page.getByTestId('importance-dropdown');
        this.taskLabelDropdown = page.getByTestId('label-dropdown');
        this.taskTitle = page.getByTestId('title-text');
    }

    async addTask({
        title = "Test Title",
        description = "Test description",
        label = "Work",
        importance = "Medium",
    }: {
        title?: string;
        description?: string;
        label?: Label;
        importance?: Importance;
    } = {}) {
        await expect(this.taskTitle).toBeVisible();
        await this.taskTitle.fill(title);
        await expect(this.taskDescription).toBeVisible();
        await this.taskDescription.fill(description);
        await expect(this.taskLabelDropdown).toBeVisible();
        await this.taskLabelDropdown.selectOption({ value: label });
        await expect(this.taskImportanceDropdown).toBeVisible();
        await this.taskImportanceDropdown.selectOption({ value: importance });
        await expect(this.addTaskButton).toBeVisible();
        await this.addTaskButton.click();
        await expect(this.taskCard.nth(0)).toBeVisible();
    }

    async deteleTask() {
        await expect(this.taskCard).toBeVisible();
        await expect(this.taskCardDeleteButton).toBeVisible();
        await this.taskCardDeleteButton.click();
        await expect(this.taskCard).toHaveCount(0);
    }

    async addMultipleTasks() {
        const tasks = [
            { title: 'Task 1', description: 'Desc 1', label: 'Work' as const, importance: 'High' as const },
            { title: 'Task 2', description: 'Desc 2', label: 'Home' as const, importance: 'Medium' as const },
            { title: 'Task 3', description: 'Desc 3', label: 'Social' as const, importance: 'Low' as const },
        ];

        for (const task of tasks) {
            await this.addTask(task);
        }
    }

    async sortTasks(sortParam: SortParam, expectedImportance: Importance) {
        await expect(this.sortingDropdown).toBeVisible();
        await this.sortingDropdown.selectOption(sortParam);
        const items = this.taskCardImportance;
        await expect(items.first()).toContainText(`Importance: ${expectedImportance}`);
    }

    async filterTasks(filterParam: "Social" | "Hobby" | "Work" | "Home") {
        await expect(this.filterDropdown).toBeVisible();
        await this.filterDropdown.selectOption(filterParam);
        await expect(this.taskCard).toHaveCount(1);
        await expect(this.taskCardLabel).toContainText(filterParam);
    }

    async addAllComboTasksAndMakeScreenshot() {
        const tasks = [
            { title: 'Task 1', description: 'Desc 1', label: 'Work' as const, importance: 'Low' as const },
            { title: 'Task 2', description: 'Desc 2', label: 'Work' as const, importance: 'Medium' as const },
            { title: 'Task 3', description: 'Desc 3', label: 'Work' as const, importance: 'High' as const },
            { title: 'Task 4', description: 'Desc 4', label: 'Social' as const, importance: 'Low' as const },
            { title: 'Task 5', description: 'Desc 5', label: 'Social' as const, importance: 'Medium' as const },
            { title: 'Task 6', description: 'Desc 6', label: 'Social' as const, importance: 'High' as const },
            { title: 'Task 7', description: 'Desc 7', label: 'Home' as const, importance: 'Low' as const },
            { title: 'Task 8', description: 'Desc 8', label: 'Home' as const, importance: 'Medium' as const },
            { title: 'Task 9', description: 'Desc 9', label: 'Home' as const, importance: 'High' as const },
            { title: 'Task 10', description: 'Desc 10', label: 'Hobby' as const, importance: 'Low' as const },
            { title: 'Task 11', description: 'Desc 11', label: 'Hobby' as const, importance: 'Medium' as const },
            { title: 'Task 12', description: 'Desc 12', label: 'Hobby' as const, importance: 'High' as const },
        ];

        for (const task of tasks) {
            await this.addTask(task);
            const card = this.page.getByText(task.title);
            await expect(card).toBeVisible();
            const fileName = `task-${task.title.replace(/\s+/g, '_')}.png`;
            await this.page.screenshot({ path: fileName, fullPage: true });
        }
    }
}
