/**
 * Events Management Module
 * Handles all event listeners and business logic
 */

class EventsManager {
    constructor(dataManager, uiManager) {
        this.dataManager = dataManager;
        this.uiManager = uiManager;
        this.editingEmployeeId = null;
        this.filteredEmployees = [];
        this.currentPage = 1;
        this.itemsPerPage = 5;
        this.sortBy = 'name';
        this.sortOrder = 'asc';
        this.activeFilters = {};
        
        this.setupEventListeners();
        this.filterEmployees(); // Initial render
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Add employee button
        this.uiManager.addEmployeeBtn.addEventListener('click', () => {
            this.openModal();
        });

        // Search functionality
        this.uiManager.searchInput.addEventListener('input', (e) => {
            this.currentPage = 1;
            this.filterEmployees();
        });

        // Filter button
        this.uiManager.filterBtn.addEventListener('click', () => {
            this.uiManager.openFilterSidebar();
        });

        // Show pages dropdown
        this.uiManager.showSelect.addEventListener('change', (e) => {
            this.itemsPerPage = parseInt(e.target.value);
            this.currentPage = 1;
            this.filterEmployees();
        });

        // Sort functionality
        this.uiManager.sortSelect.addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.currentPage = 1;
            this.filterEmployees();
        });

        // Modal close events
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                this.uiManager.closeModal();
                this.uiManager.closeFilterSidebar();
            });
        });

        // Modal backdrop click
        document.getElementById('employeeModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.uiManager.closeModal();
            }
        });

        // Filter sidebar backdrop click
        document.getElementById('filterSidebar').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.uiManager.closeFilterSidebar();
            }
        });

        // Employee form submission
        document.getElementById('employeeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEmployee();
        });

        // Cancel button
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.uiManager.closeModal();
        });

        // Filter sidebar events
        document.getElementById('applyFilterBtn').addEventListener('click', () => {
            this.applyFilters();
        });

        document.getElementById('resetFilterBtn').addEventListener('click', () => {
            this.resetFilters();
        });

        document.getElementById('closeFilterSidebar').addEventListener('click', () => {
            this.uiManager.closeFilterSidebar();
        });

        // Employee card actions (event delegation)
        document.getElementById('employeeContainer').addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return;

            const action = button.dataset.action;
            const employeeId = parseInt(button.dataset.id);

            if (action === 'edit') {
                this.editEmployee(employeeId);
            } else if (action === 'delete') {
                this.deleteEmployee(employeeId);
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Escape key to close modals
            if (e.key === 'Escape') {
                this.uiManager.closeModal();
                this.uiManager.closeFilterSidebar();
            }
        });
    }

    /**
     * Filter and sort employees
     */
    filterEmployees() {
        let filtered = [...this.dataManager.getAllEmployees()];

        // Apply search filter
        const searchTerm = this.uiManager.searchInput.value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(employee => 
                employee.firstName.toLowerCase().includes(searchTerm) ||
                employee.lastName.toLowerCase().includes(searchTerm) ||
                employee.email.toLowerCase().includes(searchTerm)
            );
        }

        // Apply sidebar filters
        if (Object.keys(this.activeFilters).length > 0) {
            filtered = filtered.filter(employee => {
                if (this.activeFilters.firstName && 
                    !employee.firstName.toLowerCase().includes(this.activeFilters.firstName.toLowerCase())) {
                    return false;
                }
                if (this.activeFilters.department && 
                    employee.department !== this.activeFilters.department) {
                    return false;
                }
                if (this.activeFilters.role && 
                    employee.role !== this.activeFilters.role) {
                    return false;
                }
                return true;
            });
        }

        // Sort employees
        filtered = this.sortEmployees(filtered);

        this.filteredEmployees = filtered;
        this.renderEmployees();
    }

    /**
     * Sort employees based on current sort criteria
     * @param {Array} employees - Array of employees to sort
     * @returns {Array} Sorted employees array
     */
    sortEmployees(employees) {
        return employees.sort((a, b) => {
            let aValue, bValue;

            switch (this.sortBy) {
                case 'name':
                    aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
                    bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
                    break;
                case 'department':
                    aValue = a.department.toLowerCase();
                    bValue = b.department.toLowerCase();
                    break;
                case 'position':
                    aValue = a.role.toLowerCase();
                    bValue = b.role.toLowerCase();
                    break;
                default:
                    aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
                    bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
            }

            if (this.sortOrder === 'asc') {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        });
    }

    /**
     * Render employees with pagination
     */
    renderEmployees() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const employeesToShow = this.filteredEmployees.slice(startIndex, endIndex);

        this.uiManager.renderEmployees(employeesToShow);
    }

    /**
     * Open modal for adding or editing employee
     * @param {number|null} employeeId - Employee ID for editing, null for adding
     */
    openModal(employeeId = null) {
        this.editingEmployeeId = employeeId;
        
        if (employeeId) {
            const employee = this.dataManager.getEmployeeById(employeeId);
            if (employee) {
                this.uiManager.openModal(employee);
            }
        } else {
            this.uiManager.openModal();
        }
    }

    /**
     * Save employee (add or update)
     */
    saveEmployee() {
        const formData = this.uiManager.getFormData();
        const validation = this.uiManager.validateForm(formData);

        if (!validation.isValid) {
            this.uiManager.showFormErrors(validation.errors);
            return;
        }

        // Check for duplicate email
        if (this.dataManager.isEmailExists(formData.email, this.editingEmployeeId)) {
            this.uiManager.showFormErrors(['An employee with this email already exists']);
            return;
        }

        try {
            if (this.editingEmployeeId) {
                // Update existing employee
                const updatedEmployee = this.dataManager.updateEmployee(this.editingEmployeeId, formData);
                if (updatedEmployee) {
                    this.uiManager.showNotification('Employee updated successfully!', 'success');
                    this.editingEmployeeId = null;
                }
            } else {
                // Add new employee
                const newEmployee = this.dataManager.addEmployee(formData);
                this.uiManager.showNotification('Employee added successfully!', 'success');
                
                // Reset filters and show all employees
                this.resetAllSettings();
            }

            this.uiManager.closeModal();
            this.filterEmployees();
        } catch (error) {
            this.uiManager.showNotification('Error saving employee. Please try again.', 'error');
        }
    }

    /**
     * Edit employee
     * @param {number} employeeId - Employee ID to edit
     */
    editEmployee(employeeId) {
        this.openModal(employeeId);
    }

    /**
     * Delete employee
     * @param {number} employeeId - Employee ID to delete
     */
    deleteEmployee(employeeId) {
        const employee = this.dataManager.getEmployeeById(employeeId);
        if (!employee) return;

        try {
            const success = this.dataManager.deleteEmployee(employeeId);
            if (success) {
                this.uiManager.showNotification('Employee deleted successfully!', 'success');
                this.filterEmployees();
            }
        } catch (error) {
            this.uiManager.showNotification('Error deleting employee. Please try again.', 'error');
        }
    }

    /**
     * Apply filters from sidebar
     */
    applyFilters() {
        const filterData = this.uiManager.getFilterData();
        this.activeFilters = {};

        // Only add non-empty filters
        Object.keys(filterData).forEach(key => {
            if (filterData[key]) {
                this.activeFilters[key] = filterData[key];
            }
        });

        this.currentPage = 1;
        this.filterEmployees();
        this.uiManager.closeFilterSidebar();
        
        if (Object.keys(this.activeFilters).length > 0) {
            this.uiManager.showNotification('Filters applied successfully!', 'info');
        }
    }

    /**
     * Reset filters
     */
    resetFilters() {
        this.activeFilters = {};
        this.uiManager.clearFilterForm();
        this.currentPage = 1;
        this.filterEmployees();
        this.uiManager.showNotification('Filters reset successfully!', 'info');
    }

    /**
     * Reset all settings (filters, search, sort, show)
     */
    resetAllSettings() {
        this.activeFilters = {};
        this.currentPage = 1;
        this.sortBy = 'name';
        this.sortOrder = 'asc';
        this.itemsPerPage = 5;
        
        this.uiManager.resetControls();
        this.filterEmployees();
    }
}

// Export for use in other modules
window.EventsManager = EventsManager; 