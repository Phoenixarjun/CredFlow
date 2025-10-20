import { useState, useEffect } from 'react';
import { Button, Flex, Heading, Text, Card, Box, Separator } from '@radix-ui/themes';
import { RocketIcon, CalendarIcon } from '@radix-ui/react-icons';
import apiClient from '@/services/apiClient';
import { toast } from 'sonner';

// Import our new components and hooks
import StatCard from '../components/StatCard';
import { useAdminStats } from '../hooks/useAdminStats';
import { useAdminKpis } from '../hooks/useAdminKpis';

// Helper to format JS Date to 'YYYY-MM-DD'
const toISODateString = (date) => {
    return date.toISOString().split('T')[0];
};

// Helper to format date/time nicely
const formatDateTime = (isoString) => {
    if (!isoString) return "Never";
    return new Date(isoString).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
};

const AdminDashboardPage = () => {
    // --- State ---
    const [isRunningEngine, setIsRunningEngine] = useState(false);
    
    // State for the date range pickers
    const [dateRange, setDateRange] = useState({
        startDate: toISODateString(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)), // 30 days ago
        endDate: toISODateString(new Date()) // Today
    });

    // --- Hooks ---
    const { stats, isLoadingStats, fetchLiveStats } = useAdminStats();
    const { kpis, isLoadingKpis, fetchKpis } = useAdminKpis();

    // Initial load for date-ranged KPIs
    useEffect(() => {
        fetchKpis(dateRange);
    }, [fetchKpis]); // fetchKpis is memoized by useCallback, dateRange is not needed
    
    // --- Event Handlers ---

    // Manual Run Engine Handler
    const handleRunEngine = async () => {
        setIsRunningEngine(true);
        toast.info("Dunning engine started manually...");
        try {
            const response = await apiClient.post('/admin/dashboard/run-engine');
            toast.success(response.data.message || "Dunning process completed!");
            
            // Re-fetch all stats after engine runs
            fetchLiveStats();
            fetchKpis(dateRange);
        } catch (error) {
            console.error("Failed to run dunning engine:", error);
            toast.error(error.response?.data?.message || "Error running dunning engine.");
        } finally {
            setIsRunningEngine(false);
        }
    };
    
    // Date change handler
    const handleDateChange = (e) => {
        setDateRange(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    // Handler for when user clicks "Apply" for dates
    const handleApplyDateRange = () => {
        fetchKpis(dateRange); // Manually trigger KPI fetch with current dateRange
    };

    return (
        <Flex direction="column" gap="6">
            <Heading>Admin Dashboard</Heading>

            {/* --- Section 1: Date Settings --- */}
            <Box>
                <Heading size="4" mb="3">Dashboard Settings</Heading>
                <Card size="2">
                    <Flex direction={{ initial: 'column', sm: 'row' }} gap="4" align="end">
                        <Flex direction="column" gap="1" className="flex-1">
                            <Text as="label" size="2" weight="medium" htmlFor="startDate">Start Date</Text>
                            <input 
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={dateRange.startDate}
                                onChange={handleDateChange}
                                className="w-full rounded-md border border-[var(--gray-7)] px-3 py-2 text-sm bg-[var(--color-background)]"
                            />
                        </Flex>
                         <Flex direction="column" gap="1" className="flex-1">
                            <Text as="label" size="2" weight="medium" htmlFor="endDate">End Date</Text>
                            <input 
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={dateRange.endDate}
                                onChange={handleDateChange}
                                className="w-full rounded-md border border-[var(--gray-7)] px-3 py-2 text-sm bg-[var(--color-background)]"
                            />
                        </Flex>
                        <Button onClick={handleApplyDateRange} disabled={isLoadingKpis}>
                            <CalendarIcon />
                            {isLoadingKpis ? 'Loading...' : 'Apply Date Range'}
                        </Button>
                    </Flex>
                </Card>
            </Box>
            
            <Separator size="4" />

            {/* --- Section 2: KPIs (Date-Ranged) --- */}
            <Box>
                <Heading size="4" mb="3">Performance (for selected range)</Heading>
                <Flex gap="4" wrap="wrap">
                    <StatCard 
                        title="Total Collected" 
                        value={kpis?.totalCollected}
                        unit="$"
                        loading={isLoadingKpis}
                    />
                    <StatCard 
                        title="Dunning Actions Executed" 
                        value={kpis?.actionsExecuted}
                        loading={isLoadingKpis}
                    />
                </Flex>
            </Box>

            {/* --- Section 3: Live Stats --- */}
            <Box>
                <Heading size="4" mb="3">Live Status</Heading>
                <Flex gap="4" wrap="wrap">
                    <StatCard 
                        title="Overdue Invoices" 
                        value={stats?.totalOverdueCount}
                        loading={isLoadingStats}
                    />
                    <StatCard 
                        title="Total Amount Overdue" 
                        value={stats?.totalOverdueAmount}
                        unit="$"
                        loading={isLoadingStats}
                    />
                    <StatCard 
                        title="Pending BPO Tasks" 
                        value={stats?.pendingTasks}
                        loading={isLoadingStats}
                    />
                </Flex>
            </Box>

            {/* --- Section 4: Engine Control --- */}
            <Box>
                <Heading size="4" mb="3">Engine Control</Heading>
                <Card size="2">
                    <Flex direction={{ initial: 'column', md: 'row' }} gap="4" align="center">
                        <Flex direction="column" gap="2" className="flex-1">
                            <Text size="2" weight="medium">
                                Manually trigger the dunning engine.
                            </Text>
                            <Text size="2" color="gray">
                                Last Run: {formatDateTime(stats?.lastRunTime)}
                            </Text>
                        </Flex>
                        <Button
                            size="3"
                            onClick={handleRunEngine}
                            disabled={isRunningEngine}
                            className="w-full md:w-auto"
                        >
                            <RocketIcon />
                            {isRunningEngine ? "Running Engine..." : "Run Dunning Engine Now"}
                        </Button>
                    </Flex>
                </Card>
            </Box>
        </Flex>
    );
};

export default AdminDashboardPage;