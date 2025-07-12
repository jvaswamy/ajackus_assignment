// Employee Management System - Vanilla JavaScript

class EmployeeManager {
    constructor() {
        this.employees = [];
        this.editingEmployeeId = null;
        this.filteredEmployees = [];
        this.currentPage = 1;
        this.itemsPerPage = 5;
        this.sortBy = 'name';
        this.sortOrder = 'asc';
        this.init();
    }

    init() {
        this.loadMockData();
        this.setupEventListeners();
        this.filterEmployees(); // This will trigger initial render with filtering and pagination
    }

    // Mock data loading (simulating Freemarker data)
    loadMockData() {
        // Simulating data that would come from Freemarker template
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
    }

    setupEventListeners() {
        // Add employee button
        document.getElementById('addEmployeeBtn').addEventListener('click', () => {
            this.openModal();
        });

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.currentPage = 1;
            this.filterEmployees();
        });



        // Filter button
        document.getElementById('filterBtn').addEventListener('click', () => {
            this.openFilterSidebar();
        });

        // Show pages dropdown
        document.getElementById('showPages').addEventListener('change', (e) => {
            this.itemsPerPage = parseInt(e.target.value);
            this.currentPage = 1;
            this.filterEmployees();
        });

        // Sort functionality
        document.getElementById('sortBy').addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.currentPage = 1;
            this.filterEmployees();
        });







        // Modal close buttons
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                this.closeModal();
            });
        });

        // Modal cancel buttons
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.closeModal();
        });

        // Form submission
        document.getElementById('employeeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEmployee();
        });



        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
            }
        });

        // Event delegation for edit and delete buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-edit')) {
                const button = e.target.closest('.btn-edit');
                const employeeId = parseInt(button.getAttribute('data-employee-id'));
                this.editEmployee(employeeId);
            }
            
            if (e.target.closest('.btn-delete')) {
                const button = e.target.closest('.btn-delete');
                const employeeId = parseInt(button.getAttribute('data-employee-id'));
                this.deleteEmployee(employeeId);
            }
        });

        // Filter sidebar event listeners
        document.getElementById('closeFilterSidebar').addEventListener('click', () => {
            this.closeFilterSidebar();
        });

        document.getElementById('applyFilterBtn').addEventListener('click', () => {
            this.applyFilters();
        });

        document.getElementById('resetFilterBtn').addEventListener('click', () => {
            this.resetFilters();
        });

        // Close filter sidebar when clicking outside
        document.addEventListener('click', (e) => {
            const filterSidebar = document.getElementById('filterSidebar');
            if (e.target === filterSidebar) {
                this.closeFilterSidebar();
            }
        });
    }

    // Filter employees based on search and filter sidebar criteria
    filterEmployees() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const firstNameFilter = document.getElementById('filterFirstName') ? document.getElementById('filterFirstName').value.toLowerCase() : '';
        const departmentFilter = document.getElementById('filterDepartment') ? document.getElementById('filterDepartment').value : '';
        const roleFilter = document.getElementById('filterRole') ? document.getElementById('filterRole').value : '';

        this.filteredEmployees = this.employees.filter(employee => {
            const matchesSearch = 
                employee.firstName.toLowerCase().includes(searchTerm) ||
                employee.lastName.toLowerCase().includes(searchTerm) ||
                employee.email.toLowerCase().includes(searchTerm) ||
                employee.role.toLowerCase().includes(searchTerm) ||
                employee.employeeId.toLowerCase().includes(searchTerm);

            const matchesFirstName = !firstNameFilter || employee.firstName.toLowerCase().includes(firstNameFilter);
            const matchesDepartment = !departmentFilter || employee.department === departmentFilter;
            const matchesRole = !roleFilter || employee.role === roleFilter;

            return matchesSearch && matchesFirstName && matchesDepartment && matchesRole;
        });

        // Sort filtered employees
        this.sortEmployees();

        // Render employees
        this.renderEmployees();
    }

    // Sort employees based on current sort settings
    sortEmployees() {
        this.filteredEmployees.sort((a, b) => {
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
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
    }





    // Render employees
    renderEmployees() {
        const container = document.getElementById('employeeContainer');
        const noResults = document.getElementById('noResults');

        if (this.filteredEmployees.length === 0) {
            container.innerHTML = '';
            noResults.style.display = 'block';
            return;
        }

        noResults.style.display = 'none';

        // Show limited number of employees based on itemsPerPage
        const employeesToShow = this.filteredEmployees.slice(0, this.itemsPerPage);

        container.innerHTML = employeesToShow.map(employee => this.createEmployeeCard(employee)).join('');
    }



    // Create employee card HTML
    createEmployeeCard(employee) {
        return `
            <div class="employee-card" data-id="${employee.id}">
                <div class="employee-header">
                    <div class="employee-info">
                        <h3>${employee.firstName} ${employee.lastName}</h3>
                        <div class="detail-row">
                            <span class="detail-label">Employee Name:</span>
                            <span class="detail-value">${employee.firstName} ${employee.lastName}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Employee ID:</span>
                            <span class="detail-value">${employee.employeeId}</span>
                        </div>
                        <p>${employee.role}</p>
                    </div>
                </div>
                <div class="employee-details">
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
                    <button class="btn btn-edit" data-employee-id="${employee.id}">Edit</button>
                    <button class="btn btn-delete" data-employee-id="${employee.id}">Delete</button>
                </div>
            </div>
        `;
    }





    // Open modal for adding/editing
    openModal(employeeId = null) {
        const modal = document.getElementById('employeeModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('employeeForm');

        this.editingEmployeeId = employeeId;

        if (employeeId) {
            // Editing existing employee
            const employee = this.employees.find(emp => emp.id === employeeId);
            if (employee) {
                modalTitle.textContent = 'Edit Employee';
                this.populateForm(employee);
            }
        } else {
            // Adding new employee
            modalTitle.textContent = 'Add New Employee';
            form.reset();
        }

        modal.style.display = 'block';
    }

    // Close modal
    closeModal() {
        const modal = document.getElementById('employeeModal');
        modal.style.display = 'none';
        this.editingEmployeeId = null;
    }

    // Populate form with employee data
    populateForm(employee) {
        document.getElementById('firstName').value = employee.firstName;
        document.getElementById('lastName').value = employee.lastName;
        document.getElementById('email').value = employee.email;
        document.getElementById('department').value = employee.department;
        document.getElementById('role').value = employee.role;
    }

    // Save employee (add or update)
    saveEmployee() {
        const formData = new FormData(document.getElementById('employeeForm'));
        const employeeData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            department: formData.get('department'),
            role: formData.get('role')
        };

        if (this.editingEmployeeId) {
            // Update existing employee
            const index = this.employees.findIndex(emp => emp.id === this.editingEmployeeId);
            if (index !== -1) {
                this.employees[index] = { ...this.employees[index], ...employeeData };
            }
        } else {
            // Add new employee
            const newId = Math.max(...this.employees.map(emp => emp.id), 0) + 1;
            const employeeId = `EMP${String(newId).padStart(3, '0')}`;
            this.employees.push({
                id: newId,
                employeeId: employeeId,
                ...employeeData
            });
            
            // Reset all settings when adding new employee if no results are currently shown
            if (this.filteredEmployees.length === 0) {
                this.resetAllSettings();
                this.showNotification('New employee added! All settings have been reset to show all employees.', 'success');
                return;
            }
        }

        this.closeModal();
        this.filterEmployees(); // This will trigger re-render with filtering
        this.showNotification('Employee saved successfully!', 'success');
    }

    // Edit employee
    editEmployee(employeeId) {
        this.openModal(employeeId);
    }

    // Delete employee
    deleteEmployee(employeeId) {
        this.employees = this.employees.filter(emp => emp.id !== employeeId);
        this.filterEmployees(); // This will trigger re-render with filtering
        this.showNotification('Employee deleted successfully!', 'success');
    }

    // Open filter sidebar
    openFilterSidebar() {
        const filterSidebar = document.getElementById('filterSidebar');
        filterSidebar.classList.add('active');
    }

    // Close filter sidebar
    closeFilterSidebar() {
        const filterSidebar = document.getElementById('filterSidebar');
        filterSidebar.classList.remove('active');
    }

    // Apply filters from sidebar
    applyFilters() {
        this.currentPage = 1;
        this.filterEmployees();
        this.closeFilterSidebar();
        this.showNotification('Filters applied successfully!', 'success');
    }

    // Reset filters
    resetFilters() {
        document.getElementById('filterFirstName').value = '';
        document.getElementById('filterDepartment').value = '';
        document.getElementById('filterRole').value = '';
        this.currentPage = 1;
        this.filterEmployees();
        this.showNotification('Filters reset successfully!', 'success');
    }

    // Reset all filters, sort, and show settings
    resetAllSettings() {
        // Reset filter fields
        document.getElementById('filterFirstName').value = '';
        document.getElementById('filterDepartment').value = '';
        document.getElementById('filterRole').value = '';
        
        // Reset sort to default
        document.getElementById('sortBy').value = 'name';
        this.sortBy = 'name';
        
        // Reset show to default
        document.getElementById('showPages').value = '5';
        this.itemsPerPage = 5;
        
        // Reset search
        document.getElementById('searchInput').value = '';
        
        this.currentPage = 1;
        this.filterEmployees();
    }



    // Show notification
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#d4edda' : '#d1ecf1'};
            color: ${type === 'success' ? '#155724' : '#0c5460'};
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
            animation: slideInRight 0.3s ease;
        `;

        // Add keyframe animation
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the application
let employeeManager;

document.addEventListener('DOMContentLoaded', () => {
    employeeManager = new EmployeeManager();
}); 