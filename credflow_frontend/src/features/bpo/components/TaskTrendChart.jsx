import React from 'react';
import { Card, Heading, Text, Box } from '@radix-ui/themes';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const TaskTrendChart = ({ data, isLoading }) => {

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="p-2 bg-white dark:bg-[var(--gray-3)] shadow-lg rounded-md border border-gray-300 dark:border-gray-700">
                    <p className="font-medium">{label}</p>
                    <p style={{ color: 'var(--blue-9)' }}>
                        Tasks Resolved: {payload[0].value}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card>
            <Heading size="4" mb="2">Tasks Resolved (Last 7 Days)</Heading>
            <Text as="p" size="2" color="gray" mb="4">
                Your daily task completion trend.
            </Text>
            
            <Box style={{ width: '100%', height: 300 }}>
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis dataKey="name" fontSize={12} />
                            <YAxis allowDecimals={false} fontSize={12} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar 
                                dataKey="tasks" 
                                fill="var(--blue-9)" 
                                name="Tasks Resolved" 
                                radius={[4, 4, 0, 0]} 
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </Box>
        </Card>
    );
};

export default TaskTrendChart;