// CMPE 012 - CRUD To-Do List Application
// JavaScript with LocalStorage

// Task Manager Class
class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.renderTasks();
        this.updateStats();
        
        // Add Enter key support
        document.getElementById('taskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTaskFromInput();
            }
        });
    }

    // ========== CREATE ==========
    addTask(text) {
        if (!text || text.trim() === '') {
            alert('Please enter a task!');
            return;
        }

        const newTask = {
            id: Date.now(), // Unique ID
            text: text.trim(),
            completed: false,
            createdAt: new Date().toLocaleString(),
            updatedAt: new Date().toLocaleString()
        };

        this.tasks.unshift(newTask); // Add to beginning
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        
        console.log('CREATE: New task added');
        return newTask;
    }

    addTaskFromInput() {
        const input = document.getElementById('taskInput');
        const text = input.value;
        if (text.trim()) {
            this.addTask(text);
            input.value = ''; // Clear input
            input.focus(); // Keep cursor in input
        }
    }

    // ========== READ ==========
    loadTasks() {
        const tasksJson = localStorage.getItem('cmpe012-tasks');
        return tasksJson ? JSON.parse(tasksJson) : [];
    }

    renderTasks() {
        const container = document.getElementById('taskList');
        
        if (this.tasks.length === 0) {
            container.innerHTML = '<div class="no-tasks">No tasks yet. Add your first task above!</div>';
            return;
        }

        const tasksHtml = this.tasks.map(task => `
            <div class="task ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <input type="checkbox" class="task-checkbox" 
                       ${task.completed ? 'checked' : ''}
                       onchange="taskManager.toggleTask(${task.id})">
                
                <div class="task-content">
                    <div class="task-text ${task.completed ? 'completed' : ''}">
                        ${this.escapeHtml(task.text)}
                    </div>
                    <div class="task-date">
                        Created: ${task.createdAt}
                    </div>
                </div>
                
                <div class="task-actions">
                    <button class="action-btn edit-btn" onclick="taskManager.editTask(${task.id})">
                        Edit
                    </button>
                    <button class="action-btn delete-btn" onclick="taskManager.deleteTask(${task.id})">
                        Delete
                    </button>
                </div>
            </div>
        `).join('');

        container.innerHTML = tasksHtml;
    }

    // ========== UPDATE ==========
    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            task.updatedAt = new Date().toLocaleString();
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            console.log(`UPDATE: Task ${id} toggled to ${task.completed ? 'completed' : 'pending'}`);
        }
    }

    editTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        const newText = prompt('Edit your task:', task.text);
        if (newText !== null && newText.trim() !== '') {
            task.text = newText.trim();
            task.updatedAt = new Date().toLocaleString();
            this.saveTasks();
            this.renderTasks();
            console.log(`UPDATE: Task ${id} edited`);
        }
    }

    // ========== DELETE ==========
    deleteTask(id) {
        if (!confirm('Are you sure you want to delete this task?')) {
            return;
        }

        const initialLength = this.tasks.length;
        this.tasks = this.tasks.filter(task => task.id !== id);
        
        if (this.tasks.length < initialLength) {
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            console.log(`DELETE: Task ${id} removed`);
        }
    }

    clearCompleted() {
        const completedCount = this.tasks.filter(t => t.completed).length;
        if (completedCount === 0) {
            alert('No completed tasks to clear!');
            return;
        }

        if (confirm(`Clear ${completedCount} completed task(s)?`)) {
            this.tasks = this.tasks.filter(task => !task.completed);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            console.log(`DELETE: Cleared ${completedCount} completed tasks`);
        }
    }

    // ========== UTILITY FUNCTIONS ==========
    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('pendingTasks').textContent = pending;
    }

    saveTasks() {
        localStorage.setItem('cmpe012-tasks', JSON.stringify(this.tasks));
        console.log('SAVE: Tasks saved to LocalStorage');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// ========== GLOBAL FUNCTIONS ==========
let taskManager;

function initializeApp() {
    taskManager = new TaskManager();
}

function addTask() {
    taskManager.addTaskFromInput();
}

function clearCompleted() {
    taskManager.clearCompleted();
}

// ========== START THE APP ==========
document.addEventListener('DOMContentLoaded', initializeApp);