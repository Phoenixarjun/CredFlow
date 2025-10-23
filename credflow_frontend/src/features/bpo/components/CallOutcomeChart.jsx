import React, { useMemo } from 'react';
import { Card, Heading, Text, Box, Flex } from '@radix-ui/themes';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Colors for the pie chart segments
const COLORS = ['var(--green-9)', 'var(--blue-9)', 'var(--amber-9)', 'var(--red-9)', 'var(--gray-9)', 'var(--cyan-9)'];

const CallOutcomeChart = ({ data, isLoading }) => {

    // Format data: [{outcome: "Payment Promised", count: 10}] -> [{name: "Payment Promised", value: 10}]
    const chartData = useMemo(() => {
        if (!data) return [];
        return data.map(item => ({
            name: item.outcome || 'Not Specified',
            value: Number(item.count)
        }));
    }, [data]);

    const hasData = chartData.length > 0;

    return (
        <Card>
            <Heading size="4" mb="2">Call Outcomes (Last 30 Days)</Heading>
            <Text as="p" size="2" color="gray" mb="4">
                Breakdown of your logged call results.
            </Text>
            
            <Box style={{ width: '100%', height: 300 }}>
                {isLoading ? (
                    <LoadingSpinner />
                ) : !hasData ? (
                    <Flex align="center" justify="center" height="100%">
                        <Text color="gray">No call outcomes logged in the last 30 days.</Text>
                    </Flex>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={(entry) => `${entry.value}`}
                            >
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

export default CallOutcomeChart;