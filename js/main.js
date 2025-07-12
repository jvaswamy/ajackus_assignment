/**
 * Main Application Entry Point
 * Initializes all modules and starts the Employee Directory application
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize modules
    const dataManager = new EmployeeDataManager();
    const uiManager = new UIManager();
    const eventsManager = new EventsManager(dataManager, uiManager);

    // Make managers globally accessible for debugging
    window.employeeDataManager = dataManager;
    window.uiManager = uiManager;
    window.eventsManager = eventsManager;

    console.log('Employee Directory application initialized successfully!');
});

/**
 * Application Configuration
 * Global settings and constants
 */
const APP_CONFIG = {
    // Pagination settings
    DEFAULT_ITEMS_PER_PAGE: 5,
    AVAILABLE_ITEMS_PER_PAGE: [5, 10, 25, 50],
    
    // Sorting options
    SORT_OPTIONS: {
        name: 'Name',
        department: 'Department',
        position: 'Role'
    },
    
    // Departments
    DEPARTMENTS: [
        'Engineering',
        'Marketing', 
        'Sales',
        'HR',
        'Finance'
    ],
    
    // Roles by department
    ROLES: {
        Engineering: [
            'Software Engineer',
            'Senior Software Engineer',
            'Frontend Developer',
            'Backend Developer',
            'DevOps Engineer'
        ],
        Marketing: [
            'Marketing Manager',
            'Content Strategist',
            'Digital Marketing Specialist'
        ],
        Sales: [
            'Sales Representative',
            'Sales Director',
            'Sales Manager',
            'Account Executive'
        ],
        HR: [
            'HR Specialist',
            'HR Manager'
        ],
        Finance: [
            'Financial Analyst',
            'Senior Accountant'
        ]
    },
    
    // Validation rules
    VALIDATION: {
        EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        MIN_NAME_LENGTH: 2,
        MAX_NAME_LENGTH: 50
    },
    
    // UI settings
    UI: {
        NOTIFICATION_DURATION: 3000,
        MODAL_ANIMATION_DURATION: 300,
        FILTER_SIDEBAR_WIDTH: 400
    }
};

/**
 * Utility Functions
 * Helper functions used across the application
 */
const Utils = {
    /**
     * Debounce function to limit function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Format employee name
     * @param {string} firstName - First name
     * @param {string} lastName - Last name
     * @returns {string} Formatted full name
     */
    formatName(firstName, lastName) {
        return `${firstName} ${lastName}`.trim();
    },

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} True if valid email
     */
    isValidEmail(email) {
        return APP_CONFIG.VALIDATION.EMAIL_REGEX.test(email);
    },

    /**
     * Generate unique ID
     * @returns {string} Unique ID string
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    /**
     * Capitalize first letter of string
     * @param {string} str - String to capitalize
     * @returns {string} Capitalized string
     */
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },

    /**
     * Check if object is empty
     * @param {Object} obj - Object to check
     * @returns {boolean} True if object is empty
     */
    isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }
};

// Make utilities globally accessible
window.APP_CONFIG = APP_CONFIG;
window.Utils = Utils; 