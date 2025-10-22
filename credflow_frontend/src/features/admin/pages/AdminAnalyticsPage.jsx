import React from 'react';
import { Flex, Heading, Grid, Card, Text, Box } from '@radix-ui/themes';
import { CalendarIcon } from '@radix-ui/react-icons';
import { useAnalytics } from '../hooks/useAnalytics';
import OverdueAgingChart from '../components/OverdueAgingChart';
import DunningActionChart from '../components/DunningActionChart';
import BpoStatusChart from '../components/BpoStatusChart';
import StatCard from '../components/StatCard'; // Assuming you have this

const AdminAnalyticsPage = () => {
    const {
        agingReport, dunningActions, collectionPerformance, bpoStatus,
        isLoadingAging, isLoadingDunning, isLoadingCollection, isLoadingBpo,
        dateRange, setDateRange
    } = useAnalytics();

    const handleDateChange = (e) => {
        setDateRange(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <Flex direction="column" gap="6">
            <Heading>Analytics Dashboard</Heading>
            <Card size="2">
                <Flex direction={{ initial: 'column', sm: 'row' }} gap="4" align="end">
                    <Flex direction="column" gap="1" className="flex-1">
                        <Text as="label" size="2" weight="medium" htmlFor="startDate">Start Date</Text>
                        <input type="date" id="startDate" name="startDate" value={dateRange.startDate} onChange={handleDateChange} className="w-full rounded-md border border-[var(--gray-7)] px-3 py-2 text-sm bg-[var(--color-background)]" />
                    </Flex>
                    <Flex direction="column" gap="1" className="flex-1">
                        <Text as="label" size="2" weight="medium" htmlFor="endDate">End Date</Text>
                        <input type="date" id="endDate" name="endDate" value={dateRange.endDate} onChange={handleDateChange} className="w-full rounded-md border border-[var(--gray-7)] px-3 py-2 text-sm bg-[var(--color-background)]" />
                    </Flex>
                    <Flex align="center" justify="center" p="2" className="text-sm text-[var(--gray-11)]">
                        <CalendarIcon /><Text ml="2">Date-ranged charts will update.</Text>
                    </Flex>
                </Flex>
            </Card>

            <Grid columns={{ initial: '1', md: '2' }} gap="5" width="100%">
                <OverdueAgingChart data={agingReport} isLoading={isLoadingAging} />
                <DunningActionChart data={dunningActions} isLoading={isLoadingDunning} />
                <Flex direction="column" gap="5" asChild><Box>
                    <StatCard title="Total Collected (in range)" unit="$" value={collectionPerformance?.totalCollected} loading={isLoadingCollection} />
                    <StatCard title="Total Billed (in range)" unit="$" value={collectionPerformance?.totalBilled} loading={isLoadingCollection} />
                </Box></Flex>
                <BpoStatusChart data={bpoStatus} isLoading={isLoadingBpo} />
            </Grid>
        </Flex>
    );
};
export default AdminAnalyticsPage;