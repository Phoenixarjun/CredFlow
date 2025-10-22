import React, { useMemo } from 'react';
import { Card, Heading, Text, Box, Flex } from '@radix-ui/themes';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const OverdueAgingChart = ({ data, isLoading }) => {
    const chartData = useMemo(() => {
        if (!data) return [];
        return Object.entries(data).map(([key, value]) => ({ name: key, amount: parseFloat(value) }));
    }, [data]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="p-2 bg-white dark:bg-[var(--gray-3)] shadow-lg rounded-md border border-gray-300 dark:border-gray-700">
                    <p className="font-medium">{label}</p>
                    <p style={{ color: 'var(--blue-9)' }}>Amount: ${payload[0].value.toFixed(2)}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card>
            <Heading size="4" mb="2">Overdue Aging Report</Heading>
            <Text as="p" size="2" color="gray" mb="4">Live overdue amount grouped by age.</Text>
            <Box style={{ width: '100%', height: 300 }}>
                {isLoading ? <LoadingSpinner /> : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis dataKey="name" fontSize={12} />
                            <YAxis fontSize={12} tickFormatter={(value) => `$${value}`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="amount" fill="var(--blue-9)" name="Overdue Amount" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </Box>
        </Card>
    );
};
export default OverdueAgingChart;