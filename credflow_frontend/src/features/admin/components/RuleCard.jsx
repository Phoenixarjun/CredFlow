

const RuleCard = ({ rule, onEdit, onDelete }) => (
    <Card size="2">
        <Flex direction="column" gap="2">
            <Flex justify="between" align="start">
                <Box>
                    <Heading size="3">{rule.ruleName}</Heading>
                    <Text size="1" color="gray">Priority: {rule.priority}</Text>
                </Box>
                <Badge color={rule.isActive ? 'green' : 'gray'} variant="soft" radius="full" size="1">
                     {rule.isActive ? <CheckCircledIcon /> : <CrossCircledIcon />}
                     <Text ml="1">{rule.isActive ? 'Active' : 'Inactive'}</Text>
                 </Badge>
            </Flex>
            <Text size="1" color="gray">{rule.description || 'No description'}</Text>
            <Flex gap="2"><Text size="1" weight="medium">Applies:</Text> {rule.appliesToPlanType ? <Badge color="cyan" variant="soft" size="1">{rule.appliesToPlanType}</Badge> : <Text size="1" color="gray">All</Text>}</Flex>
            <Flex gap="2"><Text size="1" weight="medium">If:</Text> <Text size="1">{formatCondition(rule)}</Text></Flex>
            <Flex gap="2"><Text size="1" weight="medium">Then:</Text> <Text size="1">{formatAction(rule)}</Text></Flex>
            <Flex gap="3" mt="3">
                 <Button variant="outline" size="1" onClick={() => onEdit(rule)}><Pencil1Icon /> Edit</Button>
                 <Button variant="outline" color="red" size="1" onClick={() => onDelete(rule.ruleId)}><TrashIcon /> Delete</Button>
            </Flex>
        </Flex>
    </Card>
);


export default RuleCard;