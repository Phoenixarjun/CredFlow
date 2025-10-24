import React from 'react';
import { Badge, Text } from '@radix-ui/themes';

export const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    try {
        return new Date(isoString).toLocaleString();
    } catch (e) {
        console.error("Error formatting date:", isoString, e);
        return 'Invalid Date';
    }
};

export const invoiceColumns = [
    { key: 'invoiceNumber', header: 'Invoice #' },
    {
        key: 'amountDue',
        header: 'Amount Due',
        render: (item) => `$${item.amountDue?.toFixed(2) ?? '0.00'}`
    },
    { key: 'dueDate', header: 'Due Date' },
    {
        key: 'overdueDays',
        header: 'Days Overdue',
        render: (item) => (
            item.status === 'OVERDUE' && item.overdueDays != null ? (
                <Text color="red" size="1">{item.overdueDays} days</Text>
            ) : (
                <Text color="gray" size="1">--</Text>
            )
        )
    },
    {
        key: 'status',
        header: 'Status',
        render: (item) => (
            <Badge color={
                item.status === 'PAID' ? 'green' :
                item.status === 'OVERDUE' ? 'red' :
                item.status === 'CANCELLED' ? 'gray' : 'orange'
            }>
                {item.status}
            </Badge>
        )
    },
];

export const paymentColumns = [
    {
        key: 'paymentId',
        header: 'Payment ID',
        render: (item) => <Text size="1" color="gray">{item.paymentId}</Text>
    },
    {
        key: 'amountPaid',
        header: 'Amount',
        render: (item) => `$${item.amountPaid?.toFixed(2) ?? '0.00'}`
    },
    { key: 'paymentDate', header: 'Payment Date' },
    { key: 'paymentMethod', header: 'Method' },
    {
        key: 'status',
        header: 'Status',
        render: (item) => (
            <Badge color={
                item.status === 'SUCCESS' || item.status === 'COMPLETED' ? 'green' :
                item.status === 'FAILED' ? 'red' : 'orange'
            }>
                {item.status}
            </Badge>
        )
    },
    {
        key: 'createdAt',
        header: 'Logged At',
        render: (item) => <Text size="1" color="gray">{formatDateTime(item.createdAt)}</Text>
    },
];

export const notificationColumns = [
    {
        key: 'sentAt',
        header: 'Timestamp',
        render: (item) => <Text size="1">{formatDateTime(item.sentAt)}</Text>
    },
    { key: 'channel', header: 'Channel' },
    { key: 'templateName', header: 'Template' },
    {
        key: 'status',
        header: 'Status',
        render: (item) => (
            <Badge color={item.status === 'SENT' ? 'green' : 'red'}>
                {item.status}
            </Badge>
        )
    },
    {
        key: 'failureReason',
        header: 'Details',
        render: (item) => <Text size="1" color="gray" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.failureReason}>{item.failureReason || '--'}</Text>
    },
];

export const dunningActionColumns = [
    {
        key: 'createdAt',
        header: 'Timestamp',
        render: (item) => <Text size="1">{formatDateTime(item.createdAt)}</Text>
    },
    { key: 'actionType', header: 'Action Type' },
    {
        key: 'invoiceId',
        header: 'Invoice ID',
        render: (item) => <Text size="1" color="gray">{item.invoiceId}</Text>
    },
];