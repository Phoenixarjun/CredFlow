import React, { useState, useMemo } from 'react';
import { Flex, Heading, Text, Card, Button, Badge, Grid, Box, Tabs, Select, Slider } from '@radix-ui/themes';
import { usePlans, useSelectPlan } from '../hooks/usePlans';
import { useCustomerData } from '../hooks/useCustomerData'; 
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { CheckIcon, ArrowRightIcon, MobileIcon, ReaderIcon, MixerHorizontalIcon, Cross2Icon } from '@radix-ui/react-icons';
import { toast } from 'sonner';
import { AccountTypes } from '@/enums/dunningEnums';

const FilterControls = ({ 
    onTabChange, 
    onServiceChange, 
    onPriceRangeChange,
    onSpeedRangeChange,
    activeTab, 
    activeService,
    priceRange,
    speedRange,
    showAdvanced,
    onToggleAdvanced 
}) => {
    const iconMap = {
        MOBILE: <MobileIcon width="16" height="16" />,
        BROADBAND: <ReaderIcon width="16" height="16" />,
    };

    return (
        <Card className="border border-gray-200 dark:border-gray-700">
            <Flex direction="column" gap="4">
                {/* Main Tabs */}
                <Tabs.Root value={activeTab} onValueChange={onTabChange}>
                    <Tabs.List size="2" className="border-b border-gray-100 dark:border-gray-800">
                        <Tabs.Trigger value="POSTPAID" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
                            Postpaid Plans
                        </Tabs.Trigger>
                        <Tabs.Trigger value="PREPAID" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
                            Prepaid Plans
                        </Tabs.Trigger>
                    </Tabs.List>
                </Tabs.Root>
                
                {/* Service Type Filters */}
                <Flex gap="3" align="center" wrap="wrap">
                    <Text size="2" weight="medium" >Service Type:</Text>
                    <Button 
                        variant={activeService === 'ALL' ? 'solid' : 'soft'}
                        size="1"
                        onClick={() => onServiceChange('ALL')}
                        className="transition-all duration-200"
                    >
                        All Services
                    </Button>
                    {AccountTypes.map(type => (
                        <Button 
                            key={type.value}
                            variant={activeService === type.value ? 'solid' : 'soft'}
                            size="1"
                            onClick={() => onServiceChange(type.value)}
                            className="transition-all duration-200"
                        >
                            {iconMap[type.value]} {type.label}
                        </Button>
                    ))}
                </Flex>

                {/* Advanced Filters Toggle */}
                <Flex justify="between" align="center">
                    <Button 
                        variant="ghost" 
                        size="1" 
                        onClick={onToggleAdvanced}
                        className="text-blue-600 dark:text-blue-400"
                    >
                        <MixerHorizontalIcon width="16" height="16" />
                        {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
                    </Button>
                    
                    {(priceRange[0] > 0 || priceRange[1] < 200 || speedRange[0] > 0) && (
                        <Button 
                            variant="ghost" 
                            size="1" 
                            color="red"
                            onClick={() => {
                                onPriceRangeChange([0, 200]);
                                onSpeedRangeChange([0, 1000]);
                            }}
                        >
                            <Cross2Icon width="16" height="16" />
                            Clear Filters
                        </Button>
                    )}
                </Flex>

                {/* Advanced Filters */}
                {showAdvanced && (
                    <Flex direction="column" gap="4" className="pt-4 border-t border-gray-100 dark:border-gray-800">
                        {/* Price Range */}
                        <Flex direction="column" gap="2">
                            <Flex justify="between">
                                <Text size="2" weight="medium" >
                                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                                </Text>
                                <Text size="1" >Max: $200</Text>
                            </Flex>
                            <Slider 
                                value={priceRange}
                                onValueChange={onPriceRangeChange}
                                min={0}
                                max={200}
                                step={5}
                                className="w-full"
                            />
                        </Flex>

                        {/* Speed Range */}
                        <Flex direction="column" gap="2">
                            <Flex justify="between">
                                <Text size="2" weight="medium" >
                                    Speed: {speedRange[0]}mbps - {speedRange[1]}mbps
                                </Text>
                                <Text size="1" >Max: 1000mbps</Text>
                            </Flex>
                            <Slider 
                                value={speedRange}
                                onValueChange={onSpeedRangeChange}
                                min={0}
                                max={1000}
                                step={50}
                                className="w-full"
                            />
                        </Flex>
                    </Flex>
                )}
            </Flex>
        </Card>
    );
};

const PlanCard = ({ plan, onSelect, isSubmitting, hasAccount }) => {
    const getSpeedColor = (speed) => {
        const speedNum = parseInt(speed);
        if (speedNum >= 500) return 'bg-purple-100 text-purple-800 ';
        if (speedNum >= 100) return 'bg-blue-100 text-blue-800 ';
        return 'bg-green-100 text-green-800 ';
    };

    return (
        <Card className="group transition-all duration-300 hover:shadow-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600">
            <Flex direction="column" gap="4" height="100%">
                {/* Header */}
                <Flex justify="between" align="start">
                    <Flex direction="column" gap="1">
                        <Heading size="4">
                            {plan.planName}
                        </Heading>
                        <Badge 
                            color={plan.planType === 'POSTPAID' ? 'red' : 'teal'} 
                            variant="soft" 
                            size="1"
                            className="w-fit"
                        >
                            {plan.planType}
                        </Badge>
                    </Flex>
                </Flex>
                
                {/* Price */}
                <Box>
                    <Flex align="end" gap="1">
                        <Text size="6" weight="bold" >
                            ${plan.price.toFixed(2)}
                        </Text>
                        <Text size="2" className="text-gray-500 dark:text-gray-400 mb-1">
                            /month
                        </Text>
                    </Flex>
                </Box>
                
                {/* Service Type */}
                <Badge 
                    color={plan.type === 'BROADBAND' ? 'blue' : 'green'} 
                    variant="outline" 
                    size="1" 
                    className="w-fit"
                >
                    {plan.type.replace('_', ' ')}
                </Badge>

                {/* Features */}
                <Flex direction="column" gap="3" my="2">
                    <Flex align="center" gap="3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckIcon width="14" height="14" className="text-white" />
                        </div>
                        <Badge 
                            className={getSpeedColor(plan.defaultSpeed)}
                            size="1"
                        >
                            {plan.defaultSpeed}
                        </Badge>
                    </Flex>
                    
                    {plan.dataLimit && (
                        <Flex align="center" gap="3">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <CheckIcon width="14" height="14" className="text-white" />
                            </div>
                            <Text size="2" className="text-gray-600 dark:text-gray-400">
                                {plan.dataLimit} Data
                            </Text>
                        </Flex>
                    )}
                </Flex>
                
                {/* Action Button */}
                <Box mt="auto">
                    <Button 
                        size="2" 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 group-hover:scale-105"
                        onClick={() => onSelect(plan.planId)}
                        disabled={isSubmitting || !hasAccount}
                    >
                        {isSubmitting ? (
                            <Flex align="center" gap="2">
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Selecting...
                            </Flex>
                        ) : (
                            <Flex align="center" gap="2">
                                Choose Plan
                                <ArrowRightIcon width="16" height="16" />
                            </Flex>
                        )}
                    </Button>
                    {!hasAccount && (
                        <Text size="1" color="red" align="center" mt="2">
                            No account available
                        </Text>
                    )}
                </Box>
            </Flex>
        </Card>
    );
};

const PlanMarketplacePage = () => {
    const { plans, isLoadingPlans } = usePlans();
    const { accounts, loading: isLoadingAccounts, refetchData } = useCustomerData();
    const { selectPlan, isSubmittingPlan } = useSelectPlan();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('POSTPAID');
    const [activeService, setActiveService] = useState('ALL');
    const [priceRange, setPriceRange] = useState([0, 200]);
    const [speedRange, setSpeedRange] = useState([0, 1000]);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const filteredPlans = useMemo(() => {
        console.log('All plans:', plans); // Debug: Check what plans you have
        console.log('Active tab:', activeTab); // Debug: Check active tab
        
        return plans.filter(plan => {
            // Debug each plan's planType
            console.log(`Plan: ${plan.planName}, planType: ${plan.planType}, matches tab: ${plan.planType === activeTab}`);
            
            const matchesTab = plan.planType === activeTab;
            const matchesService = activeService === 'ALL' || plan.type === activeService;
            
            // Extract speed number from string like "50mbps"
            const speedNum = parseInt(plan.defaultSpeed) || 0;
            const matchesPrice = plan.price >= priceRange[0] && plan.price <= priceRange[1];
            const matchesSpeed = speedNum >= speedRange[0] && speedNum <= speedRange[1];

            const shouldInclude = matchesTab && matchesService && matchesPrice && matchesSpeed;
            console.log(`Plan ${plan.planName} included: ${shouldInclude}`); // Debug inclusion
            
            return shouldInclude;
        });
    }, [plans, activeTab, activeService, priceRange, speedRange]);

    // Debug: Check what plans are available by type
    const planTypesAvailable = useMemo(() => {
        const types = plans.map(plan => plan.planType);
        return [...new Set(types)]; // Get unique plan types
    }, [plans]);

    console.log('Available plan types:', planTypesAvailable); // Debug: See what plan types exist

    if (isLoadingPlans || isLoadingAccounts) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    const primaryAccount = accounts.length > 0 ? accounts[0] : null;

    const handlePlanSelect = async (planId) => {
        if (!primaryAccount) {
            toast.error("No active account found to assign this plan to.");
            return;
        }
        
        const success = await selectPlan(primaryAccount.accountId, planId);
        if (success) {
            await refetchData(); 
            navigate('/customer/status'); 
        }
    };

    return (
        <Flex direction="column" gap="6" className="max-w-7xl mx-auto w-full px-4 py-8">
            {/* Header */}
            <Flex direction="column" gap="2">
                <Heading size="7" className="text-gray-900 dark:text-white font-bold">
                    Plan Marketplace
                </Heading>
                <Text size="3" className="text-gray-600 dark:text-gray-400">
                    Discover the perfect plan tailored to your needs
                </Text>
                
                {/* Debug info - remove in production */}
                <Text size="1" className="text-gray-500">
                    Available plan types: {planTypesAvailable.join(', ')}
                </Text>
            </Flex>
            
            {/* Account Status */}
            {primaryAccount ? (
                <Card className="border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
                    <Flex align="center" gap="3" p="3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <Text size="2" className="text-green-700 dark:text-green-300">
                            Selecting plan for: <strong>{primaryAccount.accountNumber}</strong>
                        </Text>
                    </Flex>
                </Card>
            ) : (
                <Card className="border border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20">
                    <Flex align="center" gap="3" p="3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <Text size="2" className="text-red-700 dark:text-red-300">
                            No active account found to assign a plan
                        </Text>
                    </Flex>
                </Card>
            )}
           
            {/* Filters */}
            <FilterControls 
                activeTab={activeTab}
                activeService={activeService}
                priceRange={priceRange}
                speedRange={speedRange}
                showAdvanced={showAdvanced}
                onTabChange={setActiveTab}
                onServiceChange={setActiveService}
                onPriceRangeChange={setPriceRange}
                onSpeedRangeChange={setSpeedRange}
                onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
            />

            {/* Results Count */}
            <Flex justify="between" align="center">
                <Text size="2" className="text-gray-600 dark:text-gray-400">
                    {filteredPlans.length} plan{filteredPlans.length !== 1 ? 's' : ''} found
                </Text>
            </Flex>

            {/* Plans Grid */}
            {filteredPlans.length > 0 ? (
                <Grid columns={{ initial: '1', sm: '2', lg: '3', xl: '4' }} gap="5">
                    {filteredPlans.map(plan => (
                        <PlanCard 
                            key={plan.planId}
                            plan={plan}
                            onSelect={handlePlanSelect}
                            isSubmitting={isSubmittingPlan}
                            hasAccount={!!primaryAccount}
                        />
                    ))}
                </Grid>
            ) : (
                <Card className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <Flex direction="column" align="center" gap="4">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                            <ReaderIcon width="24" height="24" className="text-gray-400" />
                        </div>
                        <Heading size="4" className="text-gray-900 dark:text-white">
                            No Plans Match Your Criteria
                        </Heading>
                        <Text className="text-gray-600 dark:text-gray-400" align="center">
                            Try adjusting your filters to see more options
                        </Text>
                        <Text size="1" className="text-gray-500" align="center">
                            Current filter: {activeTab} plans
                        </Text>
                        <Button 
                            variant="soft" 
                            onClick={() => {
                                setActiveTab('POSTPAID');
                                setActiveService('ALL');
                                setPriceRange([0, 200]);
                                setSpeedRange([0, 1000]);
                            }}
                        >
                            Reset All Filters
                        </Button>
                    </Flex>
                </Card>
            )}
        </Flex>
    );
};

export default PlanMarketplacePage;