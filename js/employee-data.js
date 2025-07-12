/**
 * Employee Data Management Module
 * Handles employee data operations and mock data
 */

class EmployeeDataManager {
    constructor() {
        this.employees = [];
        this.nextId = 1;
        this.loadMockData();
    }

    /**
     * Load mock employee data (simulating Freemarker data)
     */
    loadMockData() {
        this.employees = [
            {
                id: 1,
                employeeId: 'EMP001',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@company.com',
                department: 'Engineering',
                role: 'Senior Software Engineer'
            },
            {
                id: 2,
                employeeId: 'EMP002',
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane.smith@company.com',
                department: 'Marketing',
                role: 'Marketing Manager'
            },
            {
                id: 3,
                employeeId: 'EMP003',
                firstName: 'Mike',
                lastName: 'Johnson',
                email: 'mike.johnson@company.com',
                department: 'Sales',
                role: 'Sales Representative'
            },
            {
                id: 4,
                employeeId: 'EMP004',
                firstName: 'Sarah',
                lastName: 'Williams',
                email: 'sarah.williams@company.com',
                department: 'HR',
                role: 'HR Specialist'
            },
            {
                id: 5,
                employeeId: 'EMP005',
                firstName: 'David',
                lastName: 'Brown',
                email: 'david.brown@company.com',
                department: 'Finance',
                role: 'Financial Analyst'
            },
            {
                id: 6,
                employeeId: 'EMP006',
                firstName: 'Emily',
                lastName: 'Davis',
                email: 'emily.davis@company.com',
                department: 'Engineering',
                role: 'Frontend Developer'
            },
            {
                id: 7,
                employeeId: 'EMP007',
                firstName: 'Robert',
                lastName: 'Wilson',
                email: 'robert.wilson@company.com',
                department: 'Sales',
                role: 'Sales Director'
            },
            {
                id: 8,
                employeeId: 'EMP008',
                firstName: 'Lisa',
                lastName: 'Anderson',
                email: 'lisa.anderson@company.com',
                department: 'Marketing',
                role: 'Content Strategist'
            },
            {
                id: 9,
                employeeId: 'EMP009',
                firstName: 'Michael',
                lastName: 'Taylor',
                email: 'michael.taylor@company.com',
                department: 'Engineering',
                role: 'Backend Developer'
            },
            {
                id: 10,
                employeeId: 'EMP010',
                firstName: 'Jennifer',
                lastName: 'Garcia',
                email: 'jennifer.garcia@company.com',
                department: 'HR',
                role: 'HR Manager'
            },
            {
                id: 11,
                employeeId: 'EMP011',
                firstName: 'Christopher',
                lastName: 'Martinez',
                email: 'christopher.martinez@company.com',
                department: 'Finance',
                role: 'Senior Accountant'
            },
            {
                id: 12,
                employeeId: 'EMP012',
                firstName: 'Amanda',
                lastName: 'Robinson',
                email: 'amanda.robinson@company.com',
                department: 'Sales',
                role: 'Sales Manager'
            },
            {
                id: 13,
                employeeId: 'EMP013',
                firstName: 'Daniel',
                lastName: 'Clark',
                email: 'daniel.clark@company.com',
                department: 'Engineering',
                role: 'DevOps Engineer'
            },
            {
                id: 14,
                employeeId: 'EMP014',
                firstName: 'Nicole',
                lastName: 'Rodriguez',
                email: 'nicole.rodriguez@company.com',
                department: 'Marketing',
                role: 'Digital Marketing Specialist'
            },
            {
                id: 15,
                employeeId: 'EMP015',
                firstName: 'Kevin',
                lastName: 'Lewis',
                email: 'kevin.lewis@company.com',
                department: 'Sales',
                role: 'Account Executive'
            }
        ];
        this.nextId = Math.max(...this.employees.map(emp => emp.id)) + 1;
    }

    /**
     * Get all employees
     * @returns {Array} Array of employee objects
     */
    getAllEmployees() {
        return [...this.employees];
    }

    /**
     * Get employee by ID
     * @param {number} id - Employee ID
     * @returns {Object|null} Employee object or null if not found
     */
    getEmployeeById(id) {
        return this.employees.find(emp => emp.id === id) || null;
    }

    /**
     * Add new employee
     * @param {Object} employeeData - Employee data object
     * @returns {Object} Created employee object
     */
    addEmployee(employeeData) {
        const newEmployee = {
            id: this.nextId++,
            employeeId: this.generateEmployeeId(),
            ...employeeData
        };
        this.employees.push(newEmployee);
        return newEmployee;
    }

    /**
     * Update existing employee
     * @param {number} id - Employee ID
     * @param {Object} employeeData - Updated employee data
     * @returns {Object|null} Updated employee object or null if not found
     */
    updateEmployee(id, employeeData) {
        const index = this.employees.findIndex(emp => emp.id === id);
        if (index === -1) return null;
        
        this.employees[index] = { ...this.employees[index], ...employeeData };
        return this.employees[index];
    }

    /**
     * Delete employee
     * @param {number} id - Employee ID
     * @returns {boolean} True if deleted, false if not found
     */
    deleteEmployee(id) {
        const index = this.employees.findIndex(emp => emp.id === id);
        if (index === -1) return false;
        
        this.employees.splice(index, 1);
        return true;
    }

    /**
     * Generate unique employee ID
     * @returns {string} Generated employee ID
     */
    generateEmployeeId() {
        const maxId = Math.max(...this.employees.map(emp => 
            parseInt(emp.employeeId.replace('EMP', ''))
        ), 0);
        return `EMP${String(maxId + 1).padStart(3, '0')}`;
    }

    /**
     * Check if email already exists
     * @param {string} email - Email to check
     * @param {number} excludeId - Employee ID to exclude from check
     * @returns {boolean} True if email exists
     */
    isEmailExists(email, excludeId = null) {
        return this.employees.some(emp => 
            emp.email.toLowerCase() === email.toLowerCase() && 
            emp.id !== excludeId
        );
    }

    /**
     * Get departments list
     * @returns {Array} Array of department names
     */
    getDepartments() {
        return ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
    }

    /**
     * Get roles list
     * @returns {Array} Array of role names
     */
    getRoles() {
        return [
            'Software Engineer',
            'Senior Software Engineer',
            'Frontend Developer',
            'Backend Developer',
            'DevOps Engineer',
            'Marketing Manager',
            'Content Strategist',
            'Digital Marketing Specialist',
            'Sales Representative',
            'Sales Director',
            'Sales Manager',
            'Account Executive',
            'HR Specialist',
            'HR Manager',
            'Financial Analyst',
            'Senior Accountant'
        ];
    }
}

// Export for use in other modules
window.EmployeeDataManager = EmployeeDataManager; 