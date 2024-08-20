import { expect, Page } from "@playwright/test";
import { Locator } from "playwright";
import { title } from "process";

export class TaskManagerPage {
  readonly taskManagerLabel: Locator;
  readonly taskTitleInput: Locator;
  readonly taskDescriptionInput: Locator;
  readonly addTaskButton: Locator;
  completeTaskButton: Locator;
  deleteTaskButton: Locator;
  editTaskButton: Locator;
  readonly editTitleField: Locator;
  readonly editDescriptionField: Locator;
  readonly saveEditButton: Locator;
  readonly cancelEditButton: Locator;
  readonly editImportanceDropdown: Locator;
  readonly editLabelDropdown: Locator;
  readonly completeButton: Locator;

  constructor(readonly page: Page) {
    this.addTaskButton = page.getByRole("button", { name: "Add Task" });
    this.taskDescriptionInput = page.getByPlaceholder("Task Description");
    this.taskTitleInput = page.getByPlaceholder("Task Title");
    this.taskManagerLabel = page.getByRole("heading", { name: "Task Manager" });
    this.completeTaskButton = page.getByRole("button", { name: "Complete" });
    this.deleteTaskButton = page.getByRole("button", { name: "Delete" });
    this.editTaskButton = page.getByRole("button", { name: "Edit" });
    this.editTitleField = page.getByPlaceholder("Title", { exact: true });
    this.editDescriptionField = page.getByPlaceholder("Description", {
      exact: true,
    });
    this.saveEditButton = page.getByRole("button", { name: "Save" });
    this.cancelEditButton = page.getByRole("button", { name: "Save" });
    this.editImportanceDropdown = page.locator(
      '[data-test-id="importance-selector"]'
    );
    this.editLabelDropdown = page.locator('[data-test-id="label-selector"]');
  }

  async goToTaskManagerApp() {
    await this.page.goto("http://localhost:5174/");
  }

  async clickAddTaskButton() {
    await this.addTaskButton.click();
  }

  async clickDeleteTaskButton() {
    await this.deleteTaskButton.click();
  }

  async clickEditTaskButton() {
    await this.editTaskButton.click();
  }

  // Fills 'Task title' input field with provided title
  async fillTaskTitle(title: string) {
    await this.taskTitleInput.click();
    await this.taskTitleInput.fill(title);
  }

  // Fills 'Task description' input field with provided description
  async fillTaskDescription(description: string) {
    await this.taskDescriptionInput.fill(description);
  }

  async selectImportance(importance: "Low" | "Medium" | "High" | string) {
    switch (importance) {
      case "Low":
        await this.page.selectOption("select.border", { value: "Low" });
        break;

      case "Medium":
        await this.page.selectOption("select.border", { value: "Medium" });
        break;

      case "High":
        await this.page.selectOption("select.border", { value: "High" });
        break;
    }
  }

  async editImportance(importance: "Low" | "Medium" | "High" | string) {
    switch (importance) {
      case "Low":
        await this.page.selectOption('[data-test-id="importance-selector"]', {
          value: "Low",
        });
        break;

      case "Medium":
        await this.page.selectOption('[data-test-id="importance-selector"]', {
          value: "Medium",
        });
        break;

      case "High":
        await this.page.selectOption('[data-test-id="importance-selector"]', {
          value: "High",
        });
        break;
    }
  }

  async selectLabel(label: "Work" | "Home" | "Social" | "Hobby" | string) {
    switch (label) {
      case "Work":
        await this.page.selectOption("select.border1", { value: "Work" });
        break;

      case "Home":
        await this.page.selectOption("select.border1", { value: "Home" });
        break;

      case "Social":
        await this.page.selectOption("select.border1", { value: "Social" });
        break;

      case "Hobby":
        await this.page.selectOption("select.border1", { value: "Hobby" });
        break;
    }
  }

  async assertNewTaskCreation(
    title: string,
    description: string,
    importance: string,
    label: string
  ) {
    await expect(this.page.getByRole("heading", { name: `${title}` }))
      .toBeVisible;

    await expect(this.page.getByText(`${description}`)).toBeVisible;
    await expect(
      this.page.getByText(`Importance: ${importance}`)
    ).toBeVisible();
    await expect(this.page.getByText(`Label: ${label}`)).toBeVisible();
  }

  async assertTaskIsDeleted(title: string) {
    await expect(
      this.page.getByRole("heading", { name: `${title}` })
    ).toBeHidden();
  }
}
