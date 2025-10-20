export type Importance = "Low" | "Medium" | "High";
export type Label = "Work" | "Social" | "Home" | "Hobby";

export interface Task {
  id: string; // Unique identifier for each task
  title: string; // Title of the task
  description: string; // Description of the task
  completed: boolean; // Status to indicate if the task is completed
  importance: Importance; // Importance level of the task
  label: Label; // Label to categorize the task
}

// Type guard for Task
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isTask = (obj: any): obj is Task => {
  return (
    typeof obj.id === "string" &&
    typeof obj.title === "string" &&
    typeof obj.description === "string" &&
    typeof obj.completed === "boolean" &&
    ["Low", "Medium", "High"].includes(obj.importance) &&
    ["Work", "Social", "Home", "Hobby"].includes(obj.label)
  );
};
