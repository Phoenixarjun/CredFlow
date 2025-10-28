export const DunningConditionTypes = [
    { value: 'DAYS_OVERDUE', label: 'Days Overdue' },
    { value: 'MIN_AMOUNT_DUE', label: 'Minimum Amount Due' },
    { value: 'ACCOUNT_TYPE', label: 'Account Type' },
    { value: 'DAYS_UNTIL_DUE', label: 'Days Until Due' }, // Added for prepaid
];

export const DunningActionTypes = [
    { value: 'SEND_EMAIL', label: 'Send Email' },
    { value: 'SEND_SMS', label: 'Send SMS' }, // <-- Added SMS
    { value: 'CREATE_BPO_TASK', label: 'Create BPO Task' },
    { value: 'RESTRICT_SERVICE', label: 'Restrict Service' },
    { value: 'THROTTLE_SPEED', label: 'Throttle Speed' },
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

// Reflects PlanType enum from backend
export const PlanTypes = [
    { value: 'PREPAID', label: 'Prepaid' },
    { value: 'POSTPAID', label: 'Postpaid' },
];

// Options for the 'Applies To' dropdown in the UI
export const PlanTypeOptions = [
    { value: 'ALL', label: 'All Plan Types' }, // Represents application-level 'ALL'
    ...PlanTypes, // Includes PREPAID and POSTPAID
];