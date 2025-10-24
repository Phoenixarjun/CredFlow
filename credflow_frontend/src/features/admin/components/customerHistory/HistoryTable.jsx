// Generic table component for displaying lists of items
import React from 'react';
import { Table, Text, Card, Heading } from '@radix-ui/themes';

/**
 * A generic table component for displaying history items.
 * @param {string} title - The title for the card header.
 * @param {Array<Object>} items - The array of data items to display.
 * @param {Array<{ key: string, header: string, render?: (item) => ReactNode }>} columns - Column definitions.
 * @param {string} [emptyMessage="No items found."] - Message when items array is empty.
 */
const HistoryTable = ({ title, items, columns, emptyMessage = "No items found." }) => {
    if (!items) return null; // Don't render if items is null/undefined

    return (
        <Card>
            <Heading size="4" mb="3">{title}</Heading>
            <Table.Root variant="surface" size="1">
                <Table.Header>
                    <Table.Row>
                        {columns.map(col => (
                            <Table.ColumnHeaderCell key={col.key}>{col.header}</Table.ColumnHeaderCell>
                        ))}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {items.length > 0 ? (
                        items.map((item, index) => (
                            <Table.Row key={item.id || item.logId || item.invoiceId || item.paymentId || index}>
                                {columns.map(col => (
                                    <Table.Cell key={col.key}>
                                        {col.render ? col.render(item) : (item[col.key] ?? 'N/A')}
                                    </Table.Cell>
                                ))}
                            </Table.Row>
                        ))
                    ) : (
                        <Table.Row>
                            <Table.Cell colSpan={columns.length} align="center">
                                <Text color="gray">{emptyMessage}</Text>
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table.Root>
        </Card>
    );
};

export default HistoryTable;