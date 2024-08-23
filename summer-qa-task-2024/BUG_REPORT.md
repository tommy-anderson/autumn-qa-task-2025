Bug 1: Task Created with no Title and Importance
Title: Task is created with no Title even if the required field is empty, and Importance is selected by default.
Steps to Reproduce:
	1.Click on “Add Task” without entering a Title and selecting Importance.
Expected Result: The app should prevent the task from being created and display a validation error for the missing Title .
Actual Result: The task is created without a Title, despite this being required field.
Environment: Local

Bug 2: Title Transformation After Task Creation
Title: Task Title does not start with a capital letter until after the task is created.
Steps to Reproduce:
	1.Enter a Title for the task starting with a lowercase letter.
	2.Click on “Add Task.”
Expected Result: An error should appear under the Task Title placeholder indicating that the Title is not entered with a capital letter.
Actual Result: The Title remains lowercase and only capitalizes after the task is created.
Environment: Local

Bug 3: Task Complete/Uncomplete 
Title: Confusion over task completion status and usability.
Steps to Reproduce:
	1.Add a task (it should be incomplete by default).
	2.Mark the task as complete.
Expected Result:
	1.The task’s status should be clear and intuitive.
	2.The default status should be Incomplete, and clicking the button should clearly indicate the task’s completion status.
Actual Result:
The complete/incomplete status is unclear; the default status is Complete, causing confusion about whether the task is now complete or incomplete.
Environment: Local

Bug 4: Sorting Tasks by Importance
Title: Tasks are sorted incorrectly by Importance.
Steps to Reproduce:
	1.Sort tasks by Importance in both Descending and Ascending orders.
Expected Result:
	1.Descending: Tasks should be sorted as High, Medium, Low.
	2.Ascending: Tasks should be sorted as Low, Medium, High.
Actual Result:
	1.Descending: Tasks are sorted as Medium, Low, High.
	2.Ascending: Tasks are sorted as High, Low, Medium.
Environment: Local

Bug 6: Task Deletion
Title: No confirmation on task deletion; deleting tasks with the same Title name removes all such tasks.
Steps to Reproduce:
	1.Create two tasks with the same Title name.
	2.Click on delete for one of the tasks.
Expected Result:
	1.A confirmation pop-up should appear before deleting a task.
	2.Only the selected task should be deleted.
Actual Result:
	1.The task is deleted without any confirmation.
	2.All tasks with the same Title name are deleted.
Environment: Local

Bug 7: Task Editing Issues
Title: Editing a task causes description disappearance and other issues with Importance and Label.
Steps to Reproduce:
	1.Create a task with a Title, Description, Importance, and Label.
	2.Edit the task and try to modify these fields.
Expected Result:
	1.The description should remain visible and editable.
	2.Importance and Label should be editable as well.
Actual Result:
	1.The description disappears.
	2.Importance and Label cannot be modified after selection. However, clicking "Save" displays the correct Importance and Label chosen during task editing.
	3.Clicking “Cancel” automatically marks the task as “Incomplete.”
Environment: Local
