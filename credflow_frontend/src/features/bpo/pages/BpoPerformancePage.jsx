import { Flex, Heading, Grid } from '@radix-ui/themes';
import { useBpoPerformance } from '../hooks/useBpoPerformance';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import StatCard from '@/features/admin/components/StatCard'; 
import { CheckIcon, IdCardIcon } from '@radix-ui/react-icons'; 

const BpoPerformancePage = () => {
    const { stats, isLoadingStats } = useBpoPerformance();

    if (isLoadingStats) {
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
        </Flex>
    );
};

export default BpoPerformancePage;