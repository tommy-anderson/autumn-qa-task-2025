import { test, expect } from "../fixtures/task-manager-fixture";

const title: string = `Today's tasks:`;
const description: string = "Clean the house";
const importance = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

const label = {
  HOME: "Home",
  WORK: "Work",
  SOCIAL: "Social",
  HOBBY: "Hobby",
};

test.beforeEach(async ({ taskManagerPage }) => {
  await taskManagerPage.fillTaskTitle(title);
  await taskManagerPage.fillTaskDescription(description);
  await taskManagerPage.selectImportance(importance.HIGH);
  await taskManagerPage.selectLabel(label.HOME);
  await taskManagerPage.clickAddTaskButton();
});

test("Successful Task creation", async ({ taskManagerPage }) => {
  await taskManagerPage.assertNewTaskCreation(
    title,
    description,
    importance.HIGH,
    label.HOME
  );
});

test("Delete task", async ({ taskManagerPage }) => {
  await taskManagerPage.clickDeleteTaskButton();
  await taskManagerPage.assertTaskIsDeleted(title);
});

// 3 regression tests for functional bugs found
const newTitle = "Something to do";

test.fail("Edit task title", async ({ taskManagerPage }) => {
  await taskManagerPage.clickEditTaskButton();
  await expect(taskManagerPage.editTitleField).toBeVisible();
  await taskManagerPage.editTitleField.fill(newTitle);
  await taskManagerPage.saveEditButton.click();
  await taskManagerPage.assertNewTaskCreation(
    newTitle,
    description,
    importance.HIGH,
    label.HOME
  );
});

const newDescription = "Something new";

test.fail("Edit task description", async ({ taskManagerPage }) => {
  await taskManagerPage.clickEditTaskButton();
  await expect(taskManagerPage.editDescriptionField).toBeVisible();
  await taskManagerPage.editDescriptionField.fill(newDescription);
  await taskManagerPage.saveEditButton.click();
  await taskManagerPage.assertNewTaskCreation(
    title,
    newDescription,
    importance.HIGH,
    label.HOME
  );
});

test.fail("Edit Importance", async ({ taskManagerPage }) => {
  taskManagerPage.clickEditTaskButton();
  await expect(taskManagerPage.editImportanceDropdown).toBeVisible();
  await taskManagerPage.editImportance(importance.MEDIUM);
  await taskManagerPage.saveEditButton.click();
  await taskManagerPage.assertNewTaskCreation(
    title,
    newDescription,
    importance.MEDIUM,
    label.HOME
  );
}); 
