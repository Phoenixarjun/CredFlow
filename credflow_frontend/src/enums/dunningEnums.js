export const DunningConditionTypes = [
    { value: 'DAYS_OVERDUE', label: 'Days Overdue' },
    { value: 'MIN_AMOUNT_DUE', label: 'Minimum Amount Due' },
    { value: 'ACCOUNT_TYPE', label: 'Account Type' },
];

export const DunningActionTypes = [
    { value: 'SEND_EMAIL', label: 'Send Email' },
    { value: 'CREATE_BPO_TASK', label: 'Create BPO Task' },
    { value: 'RESTRICT_SERVICE', label: 'Restrict Service' },
    { value: 'THROTTLE_SPEED', label: 'Throttle Speed' } // <-- ADD THIS
];

export const BpoPriorities = [
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' },
];

export const AccountTypes = [
    { value: 'MOBILE', label: 'Mobile' },
    { value: 'BROADBAND', label: 'Broadband' },
];

export const PlanTypes = [
    { value: 'POSTPAID', label: 'Postpaid' },
    { value: 'PREPAID', label: 'Prepaid' },
];