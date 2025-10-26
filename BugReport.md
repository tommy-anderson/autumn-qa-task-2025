# Task Manager Bug Report

**Author:** Vladislav Fussa  
**Date:** 2025-10-22  

---

## Summary
This document lists functional and UX bugs identified in the Task Manager app, along with suggestions for improvement.

---

## Bug Summary Table

| #  | Bug Title                                                          | Severity    |
|----|--------------------------------------------------------------------|-------------|
| 1  | Deleting a task removes all of the tasks with the same title  | Major       |
| 2  | Changes Revert After Refresh                                       | Critical    |
| 3  | Title is Optional                                                  | Major       |
| 4  | Title Can Start With Any Character                                 | Major / UX  |
| 5  | Importance and Label Edit UI Issue                                 | Minor / UX  |
| 6  | Label is Not Optional                                              | Major       |
| 7  | Sorting Logic Is Incorrect                                         | Major / UX  |
| 8  | Add Task Button Does Not Disable Correctly                         | Major / UX  |
| 9  | Loading Spinner on Edit Hover                                      | Minor / UX  |
| 10 | Editing With No Changes Resets Task Parameters                     | Major       |
| 11 | Editing Task Sets Status to Complete:true                          | Minor / UX  |
| 12 | Incomplete Button UX                                               | Major / UX  |
| 13 | Cancel Button Behavior                                             | Major / UX  |

---

## Environment
- OS: macOS / Windows / Linux
- Browser: Chrome 118 / Firefox 123 / Edge 118
- App version: latest commit from the homework repo

---

## Bug List

### **Bug 1 – Deleting a task removes all of the tasks with the same title**
**Steps to Reproduce:**
1. Add two tasks with the same title.
2. Click “Delete” on one of the tasks.
**Expected Result:** Only the selected task is deleted.
**Actual Result:** All tasks sharing the same title are deleted.
**Severity:** Major

---

### **Bug 2 – Changes Revert After Refresh**
**Steps to Reproduce:**
1. Add a task 
2. Edit its title, description, importance, or label.
3. Refresh the page.
4. Delete a task.
5. Refresh the page
**Expected Result:** All changes should persist.
**Actual Result:** Only newly created tasks persist; edits, completion, and deletions are reverted.
**Severity:** Critical

---

### **Bug 3 – Title is Optional**
**Steps to Reproduce:**
1. Add a task without a title.
**Expected Result:** Title is mandatory.
**Actual Result:** Task can be added with empty or space-starting title.
**Severity:** Major

---

### **Bug 4 – Title Can Start With Any Character**
**Steps to Reproduce:**
1. Add a task with a title starting with any character besides a capital letter.
**Expected Result:** Title should start with a capital letter.
**Actual Result:** Task can be added with empty or lowercase/space-starting/special-characters title.
**Severity:** Major

---

### **Bug 5 – Importance and Label Edit UI Issue**
**Steps to Reproduce:**
1. Enter the edit form of an existing task.
2. Change the importance and/or label values.
3. Observe the edit form before saving.
**Expected Result:**  
The edit form should display the currently selected importance and label, and the UI should reflect any changes immediately.
**Actual Result:**  
- The selected importance and label are not visually reflected in the edit form while editing.  
- Users do not see their edits reflected in the form fields.  
- **Note:** The changes are actually saved correctly after submitting, so the final task values are updated, but the UI is misleading.
**Severity:** Major / UX

---

### **Bug 6 – Label is Not Optional**
**Steps to Reproduce:**
1. Add a task without selecting a label.
**Expected Result:** Label should be optional.
**Actual Result:** Default label is applied if not selected, cannot create a task without a label.
**Severity:** Minor / UX

---

### **Bug 7 – Sorting Logic Is Incorrect**
**Steps to Reproduce:**
1. Sort tasks by importance ascending or descending.
**Expected Result:** ASC → Low → Medium → High; DESC → High → Medium → Low.
**Actual Result:** ASC → High → Low → Medium; DESC → Medium → Low → High (alphabetical, incorrect).
**Severity:** Major

---

### **Bug 8 – Add Task Button Does Not Disable Correctly**
**Steps to Reproduce:**
1. Try adding a task with an invalid title (empty, lowercase first character if required)
**Expected Result:** Add Task button is disabled until requirements are met.
**Actual Result:** Button can still be clicked or requirements are unclear.
**Severity:** Major / UX

---

### **Bug 9 – Loading Spinner on Edit Hover**
**Steps to Reproduce:**
1. Hover the pointer over the Edit button.
**Expected Result:** No spinner displayed.
**Actual Result:** Loading spinner is always displayed while hovering over edit button.
**Severity:** Minor / UX

---

### **Bug 10 – Editing With No Changes Resets Task Parameters**
**Steps to Reproduce:**
1. Enter edit state for a task.
2. Save the form without any changes
**Expected Result:** While in edit state, fields should populate with current task values. Nothing should change after saving.
**Actual Result:** While in edit state: Description is set to empty. After saving the task, **Description** is emptied, **Label** is set to **Hobby**, **Importance** is set to **Low**
**Severity:** Major / UX

---

### **Bug 11 – Editing Task Sets Status to Complete: true**
**Steps to Reproduce:**
1. Edit any field of a Complete: false task.
**Expected Result:** Task should retain completion status.
**Actual Result:** Task is always set to incomplete.
**Severity:** Major

---

### **Bug 12 – Incomplete Button UX and Text**
**Steps to Reproduce:**
1. Hover or click the incomplete/uncomplete button.
**Expected Result:** Button should have hover state and correct label (“Incomplete”).
**Actual Result:** Hover state does not change; label reads “Uncomplete.”
**Severity:** Major / UX (Major because it affects usability)

---

### **Bug 13 – Cancel Button Behavior**
**Steps to Reproduce:**
1. Enter edit state.
2. Click Cancel.
**Expected Result:** Edit modal closes without changing task state.
**Actual Result:** Task state may change to incomplete.
**Severity:** Major / UX

---

## Suggestions / Recommendations

1. **Title Capitalization:** Either remove the requirement for the title to start with a capital letter, or display guidance to the user (e.g., tooltip) since the Add Task button would be disabled otherwise.
2. **Action Button Order:** Consider changing the order to `Complete | Edit | Delete` to reduce accidental deletion while completing the task.
3. **Edit Button Hover State:** Save and Cancel buttons should visually respond to hover for better UX.
4. **Add Task Button:** Clearly disable when title requirements are not met, and show user feedback.
5. **Task Status** has ambiguous requirements. 
    The current status Complete/Incomplete has ambiguous outcomes. From first perspective the text could reflect the status of the task, which would mean that Complete == Complete: true and Incomplete==Complete: false
    From another perspective, the button could have imperative meaning like other buttons (Delete/Edit). In our current testing we considered that the Status Complete == Complete: false and Incomplete==Complete: true
6. **Cancel Button UI** Background could be changed to another colour, as gray suggests that the button is disabled.
7. **Enable confirm Delete** User may accidentally press the delete button, it would be more user friendly if a delete confirmation would be required before actually deleting the item.
8. **Sorting UI:** Could be more user friendly. For example, show a clear “Sort By” section with Label and Importance options:

**While Collapsed**
| Sort By | Label | Importance  |
|---------|-------|-------------|
|         | All ▽ | Ascending ▽ |

**While Expanded**
| Sort By | Label   | Importance   |
|---------|---------|--------------|
|         | All  ✔  | Descending ✔ |
|         | All  ✔  | Ascending    |
|         | Work    | Descending ✔ |
|         | Social  |              |
|         | Home    |              |
|         | Hobby   |              |

---

**End of Bug Report**
