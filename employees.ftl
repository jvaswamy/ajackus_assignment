<#-- Employee Management System - Freemarker Template -->
<#-- This template demonstrates how employee data would be loaded via Freemarker -->
<#-- In a real application, this data would come from a backend service -->

<#-- Mock employee data that would typically come from a database -->
<#assign employees = [
    {
        "id": 1,
        "employeeId": "EMP001",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@company.com",
        "department": "Engineering",
        "role": "Senior Software Engineer"
    },
    {
        "id": 2,
        "employeeId": "EMP002",
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane.smith@company.com",
        "department": "Marketing",
        "role": "Marketing Manager"
    },
    {
        "id": 3,
        "employeeId": "EMP003",
        "firstName": "Mike",
        "lastName": "Johnson",
        "email": "mike.johnson@company.com",
        "department": "Sales",
        "role": "Sales Representative"
    },
    {
        "id": 4,
        "employeeId": "EMP004",
        "firstName": "Sarah",
        "lastName": "Williams",
        "email": "sarah.williams@company.com",
        "department": "HR",
        "role": "HR Specialist"
    },
    {
        "id": 5,
        "employeeId": "EMP005",
        "firstName": "David",
        "lastName": "Brown",
        "email": "david.brown@company.com",
        "department": "Finance",
        "role": "Financial Analyst"
    },
    {
        "id": 6,
        "employeeId": "EMP006",
        "firstName": "Emily",
        "lastName": "Davis",
        "email": "emily.davis@company.com",
        "department": "Engineering",
        "role": "Frontend Developer"
    },
    {
        "id": 7,
        "employeeId": "EMP007",
        "firstName": "Robert",
        "lastName": "Wilson",
        "email": "robert.wilson@company.com",
        "department": "Sales",
        "role": "Sales Director"
    },
    {
        "id": 8,
        "employeeId": "EMP008",
        "firstName": "Lisa",
        "lastName": "Anderson",
        "email": "lisa.anderson@company.com",
        "department": "Marketing",
        "role": "Content Strategist"
    }
]>

<#-- Generate JavaScript data from Freemarker -->
<script>
// Employee data loaded via Freemarker template
const freemarkerEmployeeData = [
<#list employees as employee>
    {
        id: ${employee.id},
        employeeId: "${employee.employeeId}",
        firstName: "${employee.firstName}",
        lastName: "${employee.lastName}",
        email: "${employee.email}",
        department: "${employee.department}",
        role: "${employee.role}"
    }<#if employee_has_next>,</#if>
</#list>
];

// Function to load data from Freemarker
function loadFreemarkerData() {
    if (typeof freemarkerEmployeeData !== 'undefined') {
        return freemarkerEmployeeData;
    }
    return [];
}
</script>

<#-- Alternative: Direct data injection for server-side rendering -->
<#-- This would be used if you want to render employee cards server-side -->
<#macro renderEmployeeCard employee>
    <div class="employee-card" data-id="${employee.id}">
        <div class="employee-header">
            <div class="employee-info">
                <h3>${employee.firstName} ${employee.lastName}</h3>
                <p>${employee.role}</p>
            </div>
            <div class="employee-id">
                <span class="id-badge">${employee.employeeId}</span>
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
            <button class="btn btn-edit" onclick="employeeManager.editEmployee(${employee.id})">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-delete" onclick="employeeManager.deleteEmployee(${employee.id})">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    </div>
</#macro>

<#-- Example usage of the macro -->
<#-- 
<div id="employeeContainer" class="employee-grid">
    <#list employees as employee>
        <@renderEmployeeCard employee=employee />
    </#list>
</div>
-->

<#-- Department statistics calculation -->
<#assign departmentStats = {} />
<#list employees as employee>
    <#if !departmentStats[employee.department]??>
        <#assign departmentStats = departmentStats + {employee.department: 0} />
    </#if>
    <#assign departmentStats = departmentStats + {employee.department: departmentStats[employee.department] + 1} />
</#list>

<#-- Active employees count -->
<#assign activeEmployees = 0 />
<#list employees as employee>
    <#if employee.status == "Active">
        <#assign activeEmployees = activeEmployees + 1 />
    </#if>
</#list>

<#-- Generate statistics -->
<script>
// Statistics calculated via Freemarker
const freemarkerStats = {
    totalEmployees: ${employees?size},
    activeEmployees: ${activeEmployees},
    departments: ${departmentStats?size}
};

// Department breakdown
const departmentBreakdown = {
<#list departmentStats?keys as dept>
    "${dept}": ${departmentStats[dept]}<#if dept_has_next>,</#if>
</#list>
};
</script> 