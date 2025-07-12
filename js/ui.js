/**
 * UI Management Module
 * Handles DOM manipulation, rendering, and UI interactions
 */

class UIManager {
    constructor() {
        this.modal = document.getElementById('employeeModal');
        this.filterSidebar = document.getElementById('filterSidebar');
        this.employeeContainer = document.getElementById('employeeContainer');
        this.noResults = document.getElementById('noResults');
        this.searchInput = document.getElementById('searchInput');
        this.sortSelect = document.getElementById('sortBy');
        this.showSelect = document.getElementById('showPages');
        this.addEmployeeBtn = document.getElementById('addEmployeeBtn');
        this.filterBtn = document.getElementById('filterBtn');
    }

    /**
     * Render employee cards
     * @param {Array} employees - Array of employee objects
     */
    renderEmployees(employees) {
        if (employees.length === 0) {
            this.showNoResults();
            return;
        }

        this.hideNoResults();
        this.employeeContainer.innerHTML = employees.map(employee => 
            this.createEmployeeCard(employee)
        ).join('');
    }

    /**
     * Create employee card HTML
     * @param {Object} employee - Employee object
     * @returns {string} HTML string for employee card
     */
    createEmployeeCard(employee) {
        return `
            <div class="employee-card" data-id="${employee.id}">
                <div class="employee-header">
                    <div class="employee-info">
                        <h3>${employee.firstName} ${employee.lastName}</h3>
                        <p>${employee.role}</p>
                    </div>
                </div>
                <div class="employee-details">
                    <div class="detail-row">
                        <span class="detail-label">Employee ID:</span>
                        <span class="detail-value">${employee.employeeId}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">${employee.email}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Department:</span>
                        <span class="detail-value">${employee.department}</span>
                    </div>
                </div>
                <div class="employee-actions">
                    <button class="btn btn-edit" data-action="edit" data-id="${employee.id}">
                        Edit
                    </button>
                    <button class="btn btn-delete" data-action="delete" data-id="${employee.id}">
                        Delete
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Show no results message
     */
    showNoResults() {
        this.employeeContainer.innerHTML = '';
        this.noResults.style.display = 'block';
    }

    /**
     * Hide no results message
     */
    hideNoResults() {
        this.noResults.style.display = 'none';
    }

    /**
     * Open employee modal
     * @param {Object|null} employee - Employee object for editing, null for adding
     */
    openModal(employee = null) {
        const modalTitle = document.getElementById('modalTitle');
        const submitBtn = document.querySelector('#employeeForm button[type="submit"]');
        
        if (employee) {
            modalTitle.textContent = 'Edit Employee';
            submitBtn.textContent = 'Update Employee';
            this.populateForm(employee);
        } else {
            modalTitle.textContent = 'Add New Employee';
            submitBtn.textContent = 'Add Employee';
            this.clearForm();
        }
        
        this.modal.classList.add('active');
        this.modal.style.display = 'flex';
        
        // Focus on first input
        setTimeout(() => {
            document.getElementById('firstName').focus();
        }, 100);
    }

    /**
     * Close employee modal
     */
    closeModal() {
        this.modal.classList.remove('active');
        this.modal.style.display = 'none';
        this.clearForm();
    }

    /**
     * Populate form with employee data
     * @param {Object} employee - Employee object
     */
    populateForm(employee) {
        document.getElementById('firstName').value = employee.firstName;
        document.getElementById('lastName').value = employee.lastName;
        document.getElementById('email').value = employee.email;
        document.getElementById('department').value = employee.department;
        document.getElementById('role').value = employee.role;
    }

    /**
     * Clear form fields
     */
    clearForm() {
        document.getElementById('employeeForm').reset();
    }

    /**
     * Get form data
     * @returns {Object} Form data object
     */
    getFormData() {
        return {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            department: document.getElementById('department').value,
            role: document.getElementById('role').value
        };
    }

    /**
     * Validate form data
     * @param {Object} formData - Form data object
     * @returns {Object} Validation result with isValid and errors
     */
    validateForm(formData) {
        const errors = [];

        if (!formData.firstName) errors.push('First name is required');
        if (!formData.lastName) errors.push('Last name is required');
        if (!formData.email) errors.push('Email is required');
        if (!formData.department) errors.push('Department is required');
        if (!formData.role) errors.push('Role is required');

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            errors.push('Please enter a valid email address');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Show form validation errors
     * @param {Array} errors - Array of error messages
     */
    showFormErrors(errors) {
        // Clear previous errors
        this.clearFormErrors();
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-errors';
        errorDiv.style.cssText = 'color: #dc3545; background: #f8d7da; border: 1px solid #f5c6cb; padding: 10px; border-radius: 4px; margin-bottom: 15px;';
        errorDiv.innerHTML = `<strong>Please fix the following errors:</strong><ul style="margin: 5px 0 0 20px;">${errors.map(error => `<li>${error}</li>`).join('')}</ul>`;
        
        // Insert before form
        const form = document.getElementById('employeeForm');
        form.insertBefore(errorDiv, form.firstChild);
    }

    /**
     * Clear form validation errors
     */
    clearFormErrors() {
        const existingErrors = document.querySelector('.form-errors');
        if (existingErrors) {
            existingErrors.remove();
        }
    }

    /**
     * Open filter sidebar
     */
    openFilterSidebar() {
        this.filterSidebar.classList.add('active');
    }

    /**
     * Close filter sidebar
     */
    closeFilterSidebar() {
        this.filterSidebar.classList.remove('active');
    }

    /**
     * Get filter form data
     * @returns {Object} Filter form data
     */
    getFilterData() {
        return {
            firstName: document.getElementById('filterFirstName').value.trim(),
            department: document.getElementById('filterDepartment').value,
            role: document.getElementById('filterRole').value
        };
    }

    /**
     * Clear filter form
     */
    clearFilterForm() {
        document.getElementById('filterFirstName').value = '';
        document.getElementById('filterDepartment').value = '';
        document.getElementById('filterRole').value = '';
    }

    /**
     * Show notification message
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, info)
     */
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            animation: slideIn 0.3s ease-out;
        `;

        // Set background color based on type
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            info: '#17a2b8'
        };
        notification.style.background = colors[type] || colors.info;

        notification.textContent = message;
        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
    }

    /**
     * Update control values
     * @param {Object} controls - Control values object
     */
    updateControls(controls) {
        if (controls.search !== undefined) {
            this.searchInput.value = controls.search;
        }
        if (controls.sort !== undefined) {
            this.sortSelect.value = controls.sort;
        }
        if (controls.show !== undefined) {
            this.showSelect.value = controls.show;
        }
    }

    /**
     * Get current control values
     * @returns {Object} Current control values
     */
    getControlValues() {
        return {
            search: this.searchInput.value,
            sort: this.sortSelect.value,
            show: this.showSelect.value
        };
    }

    /**
     * Reset all controls to default
     */
    resetControls() {
        this.searchInput.value = '';
        this.sortSelect.value = 'name';
        this.showSelect.value = '5';
        this.clearFilterForm();
    }
}

// Add CSS animations for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

// Export for use in other modules
window.UIManager = UIManager; 