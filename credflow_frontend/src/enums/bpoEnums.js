export const BpoTaskStatuses = [
    { value: 'NEW', label: 'New' },
    { value: 'OPEN', label: 'Open' }, 
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'RESOLVED_PAYMENT_MADE', label: 'Resolved (Payment Made)' },
    { value: 'RESOLVED_NO_CONTACT', label: 'Resolved (No Contact)' },
    { value: 'RESOLVED_DISPUTED', label: 'Resolved (Disputed)' },
    { value: 'COMPLETED', label: 'Completed' }, 
    { value: 'CLOSED', label: 'Closed' }
];

export const BpoResolvableStatuses = [
    { value: 'IN_PROGRESS', label: 'In Progress' }, 
    { value: 'RESOLVED_PAYMENT_MADE', label: 'Resolved (Payment Made)' },
    { value: 'RESOLVED_NO_CONTACT', label: 'Resolved (No Contact)' },
    { value: 'RESOLVED_DISPUTED', label: 'Resolved (Disputed)' },
    { value: 'COMPLETED', label: 'Completed (General)' }, 
    { value: 'CLOSED', label: 'Closed' } 
];