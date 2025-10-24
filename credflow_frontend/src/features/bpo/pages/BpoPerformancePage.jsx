import { Flex, Heading, Grid, Box } from '@radix-ui/themes'; // 1. Import Box
import { useBpoPerformance } from '../hooks/useBpoPerformance';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import StatCard from '@/features/admin/components/StatCard'; 
import { CheckIcon, IdCardIcon } from '@radix-ui/react-icons'; 

import { useBpoAnalytics } from '../hooks/useBpoAnalytics';
import TaskTrendChart from '../components/TaskTrendChart';
import CallOutcomeChart from '../components/CallOutcomeChart';

const BpoPerformancePage = () => {
    const { stats, isLoadingStats } = useBpoPerformance();

    const { taskTrend, outcomeBreakdown, isLoading: isLoadingCharts } = useBpoAnalytics();

    if (isLoadingStats || isLoadingCharts) {
        return <LoadingSpinner />;
    }

    return (
        <Flex direction="column" gap="6">
            <Heading>My Performance</Heading>

            <Grid columns={{ initial: '1', sm: '2' }} gap="5">
                <StatCard
                    title="Total Tasks Resolved"
                    value={stats.totalTasksResolved}
                    icon={<CheckIcon />}
                    color="green"
                />
                <StatCard
                    title="Total Calls Logged"
                    value={stats.totalCallsLogged}
                    icon={<IdCardIcon />}
                    color="blue"
                />
            </Grid>

            <Box>
                <Grid columns={{ initial: '1', md: '2' }} gap="5">
                    <TaskTrendChart 
                        data={taskTrend} 
                        isLoading={isLoadingCharts} 
                    />
                    <CallOutcomeChart 
                        data={outcomeBreakdown} 
                        isLoading={isLoadingCharts} 
                    />
                </Grid>
            </Box>

        </Flex>
    );
};

export default BpoPerformancePage;