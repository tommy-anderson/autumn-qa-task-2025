import React, { useState } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { Task } from '../interfaces/Task';

const TaskManager: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [, setEditingTask] = useState<Task | null>(null);

    const addTask = (newTask: Task) => {
        setTasks([...tasks, newTask]);
    };

    const completeTask = (id: string) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    const deleteTask = (title: string) => {
        setTasks(tasks.filter(task => task.title !== title));
    }

    const editTask = (taskToEdit: Task) => {
        setEditingTask(taskToEdit);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Task Manager</h1>
            <TaskForm onAddTask={addTask} />
            <div className="my-4" />
            <TaskList
                tasks={tasks}
                onToggleComplete={completeTask}
                onEditTask={editTask}
                onDeleteTask={deleteTask}
            />
            {/* Include an editing form or dialog if needed */}
        </div>
    );
};

export default TaskManager;
