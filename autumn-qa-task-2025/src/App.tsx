import React, { useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { isTask, Task } from './interfaces/Task';

const App: React.FC = () => {
  const getTasksFromLocalStorage = () => {
    const tasks = localStorage.getItem('tasks');
    if (tasks) {
      // check if we have objects of type Task in local storage
      try {
        const parsedTasks = JSON.parse(tasks) as Task[];
        if (parsedTasks.length > 0 && parsedTasks.every(task => isTask(task))) {
          return parsedTasks;
        }
      } catch (error) {
        console.error('Error parsing tasks from local storage:', error);
      }
    }
    return [];
  }
  const [tasks, setTasks] = useState<Task[]>(getTasksFromLocalStorage());
  const [filter, setFilter] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<string>('asc');

  // Functions to handle adding, toggling, deleting, and editing tasks
  const handleAddTask = (task: Task) => {
    setTasks([...tasks, task]);
    // Save tasks to local storage
    localStorage.setItem('tasks', JSON.stringify([...tasks, task]));
  };

  const handleToggleComplete = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTasks = (title: string) => {
    setTasks(tasks.filter(task => task.title !== title));
  }

  const handleEditTask = (updatedTask: Task) => {
    setTasks(tasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  // Filter and sort tasks
  const filteredTasks = tasks.filter(task => filter === 'All' || task.label === filter);
  const sortedTasks = filteredTasks.sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.importance.localeCompare(b.importance);
    } else {
      return b.importance.localeCompare(a.importance);
    }
  });

  return (
    <div className="app p-4">
      <div className="flex justify-center mb-4">
        <h1 className="text-2xl font-bold">Task Manager</h1>
      </div>
      <TaskForm onAddTask={handleAddTask} />

      <div className="filter-sort mb-4 flex justify-center">
        <select onChange={(e) => setFilter(e.target.value)} value={filter} className="p-2 border rounded-md" data-testid="filter-dropdown">
          <option value="All">All</option>
          <option value="Work">Work</option>
          <option value="Social">Social</option>
          <option value="Home">Home</option>
          <option value="Hobby">Hobby</option>
        </select>
        <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder} className="p-2 border rounded-md ml-4" data-testid="sorting-dropdown">
          <option value="asc">Sort by Importance (Ascending)</option>
          <option value="desc">Sort by Importance (Descending)</option>
        </select>
      </div>
      <TaskList
        tasks={sortedTasks}
        onToggleComplete={handleToggleComplete}
        onDeleteTask={handleDeleteTasks}
        onEditTask={handleEditTask}  // Add onEditTask prop
      />
    </div>
  );
};

export default App;
