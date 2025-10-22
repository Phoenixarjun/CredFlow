import React from 'react';
import { Card, Heading, Text, Box, Flex } from '@radix-ui/themes';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const COLORS = ['var(--blue-9)', 'var(--cyan-9)', 'var(--teal-9)', 'var(--amber-9)', 'var(--red-9)'];
const formatData = (data) => {
    if (!data) return [];
    return data.map(item => ({
        name: (item.action || 'Unknown').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value: Number(item.count)
    }));
};

const DunningActionChart = ({ data, isLoading }) => {
    const chartData = formatData(data);
    const hasData = chartData.length > 0;

    return (
        <Card>
            <Heading size="4" mb="2">Dunning Action Breakdown</Heading>
            <Text as="p" size="2" color="gray" mb="4">Actions taken in the selected date range.</Text>
            <Box style={{ width: '100%', height: 300 }}>
                {isLoading ? <LoadingSpinner /> : !hasData ? (
                    <Flex align="center" justify="center" height="100%"><Text color="gray">No dunning actions found for this period.</Text></Flex>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={chartData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" label={(entry) => `${entry.value}`}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
export default DunningActionChart;