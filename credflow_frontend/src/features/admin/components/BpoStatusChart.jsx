import React from 'react';
import { Card, Heading, Text, Box, Flex } from '@radix-ui/themes';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const COLORS = { NEW: 'var(--amber-9)', IN_PROGRESS: 'var(--blue-9)', COMPLETED: 'var(--green-9)', CANCELLED: 'var(--gray-9)' };
const DEFAULT_COLOR = 'var(--gray-9)';
const formatData = (data) => {
    if (!data) return [];
    return data.map(item => ({
        name: (item.status || 'Unknown').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value: Number(item.count),
        color: COLORS[item.status] || DEFAULT_COLOR
    }));
};

const BpoStatusChart = ({ data, isLoading }) => {
    const chartData = formatData(data);
    const hasData = chartData.length > 0;

    return (
        <Card>
            <Heading size="4" mb="2">BPO Task Status</Heading>
            <Text as="p" size="2" color="gray" mb="4">Live breakdown of all BPO tasks.</Text>
            <Box style={{ width: '100%', height: 300 }}>
                {isLoading ? <LoadingSpinner /> : !hasData ? (
                    <Flex align="center" justify="center" height="100%"><Text color="gray">No BPO tasks found.</Text></Flex>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={chartData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" label={(entry) => `${entry.value}`}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => [value, 'Count']} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </Box>
        </Card>
    );
};
export default BpoStatusChart;