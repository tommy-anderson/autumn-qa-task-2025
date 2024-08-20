import React, { useState } from 'react';
import { Importance, Label, Task } from '../interfaces/Task';

interface TaskFormProps {
    onAddTask: (task: Task) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [importance, setImportance] = useState<Importance>('Medium');
    const [label, setLabel] = useState<Label>('Work');

    // function for first character to uppercase
    const capitalize = (s: string) => {
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const newTask: Task = {
            id: Math.random().toString(36).substr(2, 9),
            title: capitalize(title),
            description,
            importance,
            label,
            completed: false,
        };

        onAddTask(newTask);
        setTitle('');
        setDescription('');
        setImportance('Medium');
        setLabel('Work');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto mb-4">
            <div className="grid grid-cols-1 gap-2">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task Title"
                    className="border p-2 rounded-md w-full"
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Task Description"
                    className="border p-2 rounded-md w-full"
                    rows={3}
                />
                <div className="flex gap-2 text-center">
                    <div className='flex-1'> Select Importance </div>
                    <div className='flex-1'> Select Label </div>
                </div>
                <div className="flex gap-2">
                    <select
                        value={importance}
                        onChange={(e) => setImportance(e.target.value as 'Low' | 'Medium' | 'High')}
                        className="border p-2 rounded-md flex-1 text-center"
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                    <select
                        value={label}
                        onChange={(e) => setLabel(e.target.value as 'Work' | 'Social' | 'Home' | 'Hobby')}
                        className="border1 p-2 rounded-md flex-1 text-center"
                    >
                        <option value="Work">Work</option>
                        <option value="Social">Social</option>
                        <option value="Home">Home</option>
                        <option value="Hobby">Hobby</option>
                    </select>
                </div>
                <div className="flex justify-center mt-4">
                    <button
                        type="submit"
                        // disable cursor pointer when title is empty
                        className={`p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md ${!title && 'cursor-not-allowed'}`}
                    >
                        Add Task
                    </button>
                </div>
            </div>
        </form>
    );
};

export default TaskForm;
