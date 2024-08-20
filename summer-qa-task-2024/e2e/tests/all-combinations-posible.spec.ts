import { test } from "../fixtures/task-manager-fixture";

const title: string = `Today's tasks:`;
const description: string = "Clean the house";

const importances = ["High", "Medium", "Low"];
const labels = ["Home", "Work", "Social", "Hobby"];

let taskIndex = 1;

for (const importance of importances) {
  for (const label of labels) {
    test(`Crete task ${taskIndex} with importance = ${importance} and label = ${label}`, async ({
      taskManagerPage,
    }) => {
      await taskManagerPage.fillTaskTitle(title);
      await taskManagerPage.fillTaskDescription(description);
      await taskManagerPage.selectImportance(importance);
      await taskManagerPage.selectLabel(label);
      await taskManagerPage.clickAddTaskButton();
      await taskManagerPage.page.screenshot({
        path: `e2e/screenshots/${taskIndex}-${importance}-${label}.png`,
        fullPage: true,
      });
    });
    taskIndex++;
  }
}
