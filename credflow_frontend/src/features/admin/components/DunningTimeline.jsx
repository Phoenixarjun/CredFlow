import React, { useMemo } from 'react';
import { Box, Flex, Text, Badge, Tooltip } from '@radix-ui/themes';
import { motion } from 'framer-motion';
import { FiMail, FiZap, FiPhoneCall, FiSlash, FiActivity } from 'react-icons/fi';

// Action details mapping
const actionDetails = {
    SEND_EMAIL: { icon: FiMail, color: 'blue', label: 'Send Email' },
    THROTTLE_SPEED: { icon: FiActivity, color: 'orange', label: 'Throttle Speed' },
    RESTRICT_SERVICE: { icon: FiSlash, color: 'red', label: 'Restrict Service' },
    CREATE_BPO_TASK: { icon: FiPhoneCall, color: 'purple', label: 'Create BPO Task' },
};

// Animation variants
const timelineVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { when: "beforeChildren", staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
};

const DunningTimeline = ({ rules }) => {
    // Process rules using correct field names
    const timelineEvents = useMemo(() => {
        if (!rules) return [];
        console.log("Rules received by Timeline:", rules);
        return rules
            .filter(rule =>
                rule.isActive === true &&
                rule.conditionType === 'DAYS_OVERDUE' &&
                rule.conditionValueInteger != null
            )
            .sort((a, b) => a.conditionValueInteger - b.conditionValueInteger)
            .map(rule => {
                const details = actionDetails[rule.actionType] || { icon: FiZap, color: 'gray', label: rule.actionType };

                // Create badge label
                let badgeLabel = details.label;
                if (rule.actionType === 'CREATE_BPO_TASK' && rule.bpoTaskPriority) {
                    badgeLabel = `BPO (${rule.bpoTaskPriority.substring(0,1)})`;
                } else if (rule.actionType === 'SEND_EMAIL') {
                    badgeLabel = 'Email';
                }

                // Create tooltip content
                let tooltipContent = `${rule.ruleName}\nAction: ${details.label}`;
                if (rule.actionType === 'SEND_EMAIL' && rule.templateName) {
                    tooltipContent += `\nTemplate: ${rule.templateName}`;
                } else if (rule.actionType === 'CREATE_BPO_TASK' && rule.bpoTaskPriority) {
                    tooltipContent += `\nPriority: ${rule.bpoTaskPriority}`;
                }
                tooltipContent += `\nCondition: Days Overdue >= ${rule.conditionValueInteger}`;
                tooltipContent += `\nApplies To: ${rule.appliesToPlanType || 'All'}`;

                return {
                    day: rule.conditionValueInteger,
                    action: rule.actionType,
                    badgeLabel: badgeLabel,
                    icon: details.icon,
                    color: details.color,
                    tooltipContent: tooltipContent,
                };
            });
    }, [rules]);

    console.log("Processed Timeline Events:", timelineEvents);

    // Max day calculation
    const maxDay = useMemo(() => {
        if (timelineEvents.length === 0) return 15;
        const lastEventDay = timelineEvents[timelineEvents.length - 1]?.day || 0;
        return Math.max(15, Math.ceil((lastEventDay + 5) / 5) * 5);
    }, [timelineEvents]);

    // Tick marks calculation
    const tickMarks = useMemo(() => {
        const marks = [];
        for (let i = 0; i <= maxDay; i += 5) { 
            marks.push(i); 
        }
        return marks;
    }, [maxDay]);

    if (!timelineEvents || timelineEvents.length === 0) {
        return (
            <Box p="4" style={{ textAlign: 'center' }}>
                <Text color="gray" size="2">
                    No active rules with 'Days Overdue' condition found to display on timeline.
                </Text>
            </Box>
        );
    }

    return (
        <Box style={{ width: '100%', minWidth: '600px', overflowX: 'auto', padding: '40px 10px' }}>
            <motion.div
                variants={timelineVariants}
                initial="hidden"
                animate="visible"
                style={{ position: 'relative', minHeight: '280px', width: '100%' }}
            >
                {/* Timeline Axis Line - Centered */}
                <Box 
                    style={{ 
                        position: 'absolute', 
                        top: '140px',
                        left: '2%', 
                        right: '2%', 
                        height: '3px', 
                        backgroundColor: 'var(--gray-a6)', 
                        borderRadius: '2px'
                    }} 
                />

                {/* Tick Marks and Labels */}
                {tickMarks.map(day => (
                    <Box 
                        key={`tick-${day}`} 
                        style={{ 
                            position: 'absolute', 
                            top: '140px',
                            left: `${2 + (day / maxDay) * 96}%`, 
                            transform: 'translateX(-50%)', 
                            textAlign: 'center' 
                        }}
                    >
                        <Box 
                            style={{ 
                                width: '2px', 
                                height: '16px', 
                                backgroundColor: 'var(--gray-a8)', 
                                margin: '0 auto',
                                position: 'relative',
                                top: '-8px'
                            }} 
                        />
                        <Text 
                            size="1" 
                            color="gray" 
                            style={{ 
                                marginTop: '12px', 
                                display: 'block', 
                                whiteSpace: 'nowrap' 
                            }}
                        >
                            Day {day}
                        </Text>
                        {day === 0 && (
                            <Text 
                                size="1" 
                                color="gray" 
                                style={{ 
                                    marginTop: '2px', 
                                    display: 'block' 
                                }}
                            >
                                (Due)
                            </Text>
                        )}
                    </Box>
                ))}

                {/* Timeline Events */}
                {timelineEvents.map((event, index) => {
                    const ActionIcon = event.icon;
                    const leftPosition = `${2 + (event.day / maxDay) * 96}%`;
                    const isAbove = index % 2 === 0;

                    return (
                        <motion.div
                            key={`event-${index}-${event.day}`}
                            variants={itemVariants}
                            style={{ 
                                position: 'absolute', 
                                left: leftPosition,
                                top: isAbove ? '10px' : '170px',
                                transform: 'translateX(-50%)', 
                                zIndex: 10 + index 
                            }}
                        >
                            <Tooltip content={<div style={{ whiteSpace: 'pre-line' }}>{event.tooltipContent}</div>}>
                                <Flex 
                                    direction="column" 
                                    align="center" 
                                    gap="1"
                                    style={{
                                        flexDirection: isAbove ? 'column' : 'column-reverse'
                                    }}
                                >
                                    {/* Badge */}
                                    <Badge size="1" color={event.color} variant="soft" radius="full">
                                        <Flex align="center" gap="1" p="1">
                                            <ActionIcon size={12} />
                                            <Text size="1" weight="medium" style={{ whiteSpace: 'nowrap' }}>
                                                Day {event.day}: {event.badgeLabel}
                                            </Text>
                                        </Flex>
                                    </Badge>
                                    
                                    {/* Connecting Stem */}
                                    <Box 
                                        style={{ 
                                            width: '2px', 
                                            height: isAbove ? '105px' : '95px',
                                            backgroundColor: `var(--${event.color}-9)`
                                        }} 
                                    />
                                    
                                    {/* Dot on Timeline */}
                                    <Box 
                                        style={{ 
                                            width: '10px', 
                                            height: '10px', 
                                            borderRadius: '50%', 
                                            backgroundColor: `var(--${event.color}-9)`, 
                                            position: 'absolute', 
                                            top: isAbove ? '130px' : '109px',
                                            left: '50%', 
                                            transform: 'translateX(-50%)', 
                                            boxShadow: '0 0 0 3px var(--color-background)',
                                            zIndex: 20
                                        }} 
                                    />
                                </Flex>
                            </Tooltip>
                        </motion.div>
                    );
                })}
            </motion.div>
        </Box>
    );
};

export default DunningTimeline;