import React from 'react';
import { Table, Badge, Flex, IconButton, Tooltip, Text } from '@radix-ui/themes';
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import { FiMail, FiMessageSquare } from 'react-icons/fi';
import { formatDateTime } from '@/utils/helpers';

const getChannelInfo = (channel) => {
    switch (channel?.toUpperCase()) {
        case 'EMAIL':
            return { icon: FiMail, color: 'blue', label: 'Email' };
        case 'SMS':
            return { icon: FiMessageSquare, color: 'green', label: 'SMS' };
        default:
            return { icon: null, color: 'gray', label: channel || 'Unknown' };
    }
};

const TemplatesTable = ({ templates, onEdit, onDelete }) => {
    if (!templates || templates.length === 0) {
        return <Text color="gray" size="2">No notification templates found.</Text>;
    }

    return (
        <Table.Root variant="surface">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Channel</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Subject / Preview</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Last Updated</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell align="right">Actions</Table.ColumnHeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {templates.map((template) => {
                    const { icon: ChannelIcon, color: channelColor, label: channelLabel } = getChannelInfo(template.channel);
                    const previewText = template.body?.substring(0, 70) + (template.body?.length > 70 ? '...' : '');

                    return (
                        <Table.Row key={template.templateId}>
                            <Table.RowHeaderCell>
                                <Text weight="medium">{template.templateName}</Text>
                            </Table.RowHeaderCell>
                            <Table.Cell>
                                <Badge color={channelColor} variant="soft">
                                    {ChannelIcon && <ChannelIcon size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />}
                                    {channelLabel}
                                </Badge>
                            </Table.Cell>
                            <Table.Cell>
                                <Tooltip content={template.body}>
                                    <Flex direction="column" gap="0">
                                        {template.channel === 'EMAIL' && <Text size="2" weight="medium">{template.subject}</Text>}
                                        <Text size="1" color="gray" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>
                                            {previewText}
                                        </Text>
                                    </Flex>
                                </Tooltip>
                            </Table.Cell>
                            <Table.Cell>
                                <Text size="2" color="gray">
                                    {formatDateTime(template.updatedAt)}
                                </Text>
                            </Table.Cell>
                            <Table.Cell align="right">
                                <Flex gap="3" justify="end">
                                    <Tooltip content="Edit Template">
                                        <IconButton size="1" variant="soft" onClick={() => onEdit(template)}>
                                            <Pencil1Icon width="14" height="14" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip content="Delete Template">
                                        <IconButton size="1" variant="soft" color="red" onClick={() => onDelete(template.templateId, template.templateName)}>
                                            <TrashIcon width="14" height="14" />
                                        </IconButton>
                                    </Tooltip>
                                </Flex>
                            </Table.Cell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table.Root>
    );
};

export default TemplatesTable;