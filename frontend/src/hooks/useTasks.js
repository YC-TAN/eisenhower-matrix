import { useState, useEffect } from 'react';

/**
 * useTasks Hook
 * 
 * Manages task state with localStorage persistence.
 * Handles CRUD operations and provides filtered task groupings for the Eisenhower Matrix.
 * 
 * @param {Array} initialData - Initial tasks to load on first run (default: empty array)
 * 
 * @returns {Object} Task state management object
 * @returns {Array} tasks - All tasks (flattened)
 * @returns {Object} groupedTasks - Tasks grouped by quadrant (q1, q2, q3, q4)
 * @returns {Array} pendingTasks - Only tasks with status='pending'
 * @returns {Function} addTask - Add a new task
 * @returns {Function} updateTask - Update an existing task
 * @returns {Function} deleteTask - Delete a task by ID
 * 
 * Data Structure:
 * {
 *   id: string (UUID),
 *   text: string,
 *   important: boolean,
 *   urgent: boolean,
 *   status: 'pending' | 'completed' | 'deleted',
 *   createdAt: ISO string,
 *   completedAt: ISO string | null
 * }
 * 
 * Example:
 * const { tasks, pendingTasks, addTask } = useTasks(initialTasks);
 * addTask({ text: 'Fix bug', important: true, urgent: true });
 */
export const useTasks = (initialData=[]) => {

    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem('matrix_tasks');
        return saved ? JSON.parse(saved) : initialData;
    });

    useEffect(() => {
        localStorage.setItem('matrix_tasks', JSON.stringify(tasks));
    }, [tasks]);

    //--CRUD Operations

    /**
     * Add a new task to the task list
     * @param {Object} taskObj - Task data
     * @param {string} taskObj.text - Task description
     * @param {boolean} taskObj.important - Is task important?
     * @param {boolean} taskObj.urgent - Is task urgent?
     */
    const addTask = (taskObj) => {
        const {text, important, urgent} = taskObj;
        const newTask = {
            id: crypto.randomUUID(),
            text, 
            urgent,
            important,
            status: 'pending', // 'pending' | 'completed' | 'deleted'
            createdAt: new Date().toISOString(),
            completedAt: null
        }
        setTasks((prev) => [...prev, newTask]);
    };

    /**
     * Update an existing task
     * @param {string} id - Task ID
     * @param {Object} updates - Fields to update (text, status, important, urgent, etc.)
     */
    const updateTask = (id, updates) => {
        setTasks((prev) =>
            prev.map((t) => {
                if (t.id === id) {
                    let completedAt = t.completedAt;

                    // Handle the timestamp based on the new status
                    if (updates.status === 'completed') {
                        completedAt = new Date().toISOString();
                    } else if (updates.status === 'pending') {
                        completedAt = null; // Clear it if moving back to pending
                    }

                    return { ...t, ...updates, completedAt };
                }
                return t;
            })
        );
    };

    /**
     * Delete a task by ID
     * @param {string} id - Task ID to delete
     */
    const deleteTask = (id) => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
    };

    // --- Derived State (The Matrix Filtering) ---
    // Filter tasks by status
    const pendingTasks = tasks.filter((t) => t.status === 'pending');

    return {
        tasks,
        pendingTasks,
        addTask,
        updateTask,
        deleteTask,
    };
}