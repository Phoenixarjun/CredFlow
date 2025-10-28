import React from 'react';
import {
  Dialog,
  Flex,
  Text,
  Button,
  Heading,
  Box,
  ScrollArea,
  Badge,
  Card,
  Grid,
  Separator,
  IconButton,
} from '@radix-ui/themes';
import {
  MagicWandIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  DownloadIcon,
  Cross2Icon,
} from '@radix-ui/react-icons';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const getRiskColor = (riskLevel) => {
  switch (riskLevel?.toLowerCase()) {
    case 'high':
      return 'red';
    case 'medium':
      return 'orange';
    case 'low':
      return 'green';
    default:
      return 'gray';
  }
};

const RiskIcon = ({ riskLevel }) => {
  const color = `var(--${getRiskColor(riskLevel)}-9)`;
  switch (riskLevel?.toLowerCase()) {
    case 'high':
      return <ExclamationTriangleIcon color={color} width="18" height="18" />;
    case 'medium':
      return <InfoCircledIcon color={color} width="18" height="18" />;
    case 'low':
      return <CheckCircledIcon color={color} width="18" height="18" />;
    default:
      return <CrossCircledIcon color="var(--gray-9)" width="18" height="18" />;
  }
};

const AiSummaryModal = ({ isOpen, onClose, summary, isLoading, customerName, theme }) => {
  const handleDownload = () => {
    if (!summary) return;

    let content = `AI SUMMARY FOR ${customerName}\n`;
    content += `Generated on: ${new Date().toLocaleString()}\n`;
    content += `${'='.repeat(80)}\n\n`;

    content += `OVERALL ASSESSMENT\n`;
    content += `${'-'.repeat(80)}\n`;
    content += `Risk Level: ${summary.riskLevel || 'Unknown'}\n\n`;
    content += `${summary.executiveSummary}\n\n`;

    if (summary.financials) {
      content += `FINANCIAL HIGHLIGHTS\n`;
      content += `${'-'.repeat(80)}\n`;
      content += `Total Balance: ${summary.financials.totalBalance}\n`;
      content += `Total Overdue: ${summary.financials.totalOverdueAmount || '$0.00'}\n`;
      content += `Accounts: ${summary.financials.accountStatusSummary}\n\n`;
    }

    if (summary.keyIssues && summary.keyIssues.length > 0) {
      content += `KEY ISSUES\n`;
      content += `${'-'.repeat(80)}\n`;
      summary.keyIssues.forEach((issue, index) => {
        content += `${index + 1}. ${issue}\n\n`;
      });
    }

    if (summary.recentActivity && summary.recentActivity.length > 0) {
      content += `RECENT ACTIVITY\n`;
      content += `${'-'.repeat(80)}\n`;
      summary.recentActivity.forEach((activity, index) => {
        content += `${index + 1}. ${activity}\n\n`;
      });
    }

    content += `${'='.repeat(80)}\n`;
    content += `This is an AI-generated summary. Please verify critical information before taking action.`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AI_Summary_${customerName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content style={{ maxWidth: 700 }}>
        <Flex justify="between" align="start" mb="4">
          <Dialog.Title>
            <Flex gap="3" align="center">
              <Box
                p="2"
                style={{
                  background: 'var(--accent-3)',
                  borderRadius: 'var(--radius-2)',
                }}
              >
                <MagicWandIcon width="20" height="20" />
              </Box>
              <Box>
                <Heading size="5" mb="1">
                  AI Summary
                </Heading>
                <Text size="2" color="gray" weight="medium">
                  {customerName}
                </Text>
              </Box>
            </Flex>
          </Dialog.Title>

          <Flex gap="2" align="center">
            <Button
              variant="soft"
              color="blue"
              onClick={handleDownload}
              disabled={isLoading || !summary}
            >
              <DownloadIcon width="16" height="16" />
              Download Summary
            </Button>
            <Dialog.Close>
              <IconButton variant="ghost" color="gray">
                <Cross2Icon width="18" height="18" />
              </IconButton>
            </Dialog.Close>
          </Flex>
        </Flex>

        <Separator size="4" my="3" />

        <Dialog.Description size="2" mb="4" color="gray">
          AI-generated overview of customer's financial health and recent activity
        </Dialog.Description>

        <Box style={{ minHeight: '400px', maxHeight: '65vh', position: 'relative' }}>
          {isLoading ? (
            <LoadingSpinner text="Generating summary..." />
          ) : !summary || !summary.executiveSummary ? (
            <Flex align="center" justify="center" style={{ height: '400px' }}>
              <Text color="gray">No summary data available.</Text>
            </Flex>
          ) : (
            <ScrollArea
              type="auto"
              scrollbars="vertical"
              style={{ height: '100%' }}
              className="modal-scroll"
            >
              <Box pr="3">
                <Flex direction="column" gap="5">
                  <Card size="3">
                    <Flex direction="column" gap="3">
                      <Flex align="center" justify="between">
                        <Heading size="3">Overall Assessment</Heading>
                        <Flex gap="2" align="center">
                          <RiskIcon riskLevel={summary.riskLevel} />
                          <Badge
                            size="2"
                            color={getRiskColor(summary.riskLevel)}
                            variant="soft"
                            radius="full"
                          >
                            {summary.riskLevel || 'Unknown'} Risk
                          </Badge>
                        </Flex>
                      </Flex>
                      <Separator size="4" />
                      <Text
                        as="p"
                        size="3"
                        style={{
                          whiteSpace: 'pre-wrap',
                          lineHeight: '1.6',
                          color: 'var(--gray-12)',
                        }}
                      >
                        {summary.executiveSummary}
                      </Text>
                    </Flex>
                  </Card>

                  {summary.financials && (
                    <Box>
                      <Heading size="3" mb="3">
                        Financial Highlights
                      </Heading>
                      <Grid columns={{ initial: '1', sm: '3' }} gap="3">
                        <Card size="2" style={{ background: 'var(--gray-2)' }}>
                          <Flex direction="column" gap="2">
                            <Text size="2" color="gray" weight="medium">
                              Total Balance
                            </Text>
                            <Text
                              size="5"
                              weight="bold"
                              style={{ color: 'var(--gray-12)' }}
                            >
                              {summary.financials.totalBalance}
                            </Text>
                          </Flex>
                        </Card>
                        <Card
                          size="2"
                          style={{
                            background:
                              !summary.financials.totalOverdueAmount ||
                              summary.financials.totalOverdueAmount === '$0.00'
                                ? 'var(--green-2)'
                                : 'var(--red-2)',
                          }}
                        >
                          <Flex direction="column" gap="2">
                            <Text size="2" color="gray" weight="medium">
                              Total Overdue
                            </Text>
                            <Text
                              size="5"
                              weight="bold"
                              color={
                                !summary.financials.totalOverdueAmount ||
                                summary.financials.totalOverdueAmount === '$0.00'
                                  ? 'green'
                                  : 'red'
                              }
                            >
                              {summary.financials.totalOverdueAmount || '$0.00'}
                            </Text>
                          </Flex>
                        </Card>
                        <Card size="2" style={{ background: 'var(--gray-2)' }}>
                          <Flex direction="column" gap="2">
                            <Text size="2" color="gray" weight="medium">
                              Accounts
                            </Text>
                            <Text
                              size="5"
                              weight="bold"
                              style={{ color: 'var(--gray-12)' }}
                            >
                              {summary.financials.accountStatusSummary}
                            </Text>
                          </Flex>
                        </Card>
                      </Grid>
                    </Box>
                  )}

                  {summary.keyIssues && summary.keyIssues.length > 0 && (
                    <Box>
                      <Heading size="3" mb="3">
                        Key Issues
                      </Heading>
                      <Card size="2" style={{ background: 'var(--orange-2)' }}>
                        <Flex direction="column" gap="3">
                          {summary.keyIssues.map((issue, index) => (
                            <React.Fragment key={index}>
                              {index > 0 && <Separator size="4" />}
                              <Flex gap="3" align="start">
                                <Box
                                  style={{
                                    flexShrink: 0,
                                    paddingTop: '2px',
                                    background: 'var(--orange-4)',
                                    padding: '6px',
                                    borderRadius: 'var(--radius-2)',
                                  }}
                                >
                                  <ExclamationTriangleIcon
                                    color="var(--orange-11)"
                                    width="16"
                                    height="16"
                                  />
                                </Box>
                                <Text
                                  size="2"
                                  style={{
                                    whiteSpace: 'pre-wrap',
                                    lineHeight: '1.6',
                                    flex: 1,
                                  }}
                                >
                                  {issue}
                                </Text>
                              </Flex>
                            </React.Fragment>
                          ))}
                        </Flex>
                      </Card>
                    </Box>
                  )}

                  {summary.recentActivity && summary.recentActivity.length > 0 && (
                    <Box>
                      <Heading size="3" mb="3">
                        Recent Activity
                      </Heading>
                      <Card size="2" style={{ background: 'var(--blue-2)' }}>
                        <Flex direction="column" gap="3">
                          {summary.recentActivity.map((activity, index) => (
                            <React.Fragment key={index}>
                              {index > 0 && <Separator size="4" />}
                              <Flex gap="3" align="start">
                                <Box
                                  style={{
                                    flexShrink: 0,
                                    paddingTop: '2px',
                                    background: 'var(--blue-4)',
                                    padding: '6px',
                                    borderRadius: 'var(--radius-2)',
                                  }}
                                >
                                  <InfoCircledIcon
                                    color="var(--blue-11)"
                                    width="16"
                                    height="16"
                                  />
                                </Box>
                                <Text
                                  size="2"
                                  style={{
                                    whiteSpace: 'pre-wrap',
                                    lineHeight: '1.6',
                                    flex: 1,
                                  }}
                                >
                                  {activity}
                                </Text>
                              </Flex>
                            </React.Fragment>
                          ))}
                        </Flex>
                      </Card>
                    </Box>
                  )}

                  <Box
                    p="3"
                    style={{
                      background: 'var(--gray-2)',
                      borderRadius: 'var(--radius-3)',
                      borderLeft: '3px solid var(--gray-6)',
                    }}
                  >
                    <Text
                      size="1"
                      color="gray"
                      style={{ fontStyle: 'italic' }}
                    >
                      This is an AI-generated summary. Please verify critical
                      information before taking action.
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </ScrollArea>
          )}
        </Box>

        <style>{`
          .modal-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .modal-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .modal-scroll::-webkit-scrollbar-thumb {
            background: ${
              theme === 'dark'
                ? 'rgba(75, 85, 99, 0.5)'
                : 'rgba(147, 197, 253, 0.5)'
            };
            border-radius: 3px;
            transition: background 0.2s;
          }
          .modal-scroll::-webkit-scrollbar-thumb:hover {
            background: ${
              theme === 'dark'
                ? 'rgba(107, 114, 128, 0.8)'
                : 'rgba(96, 165, 250, 0.8)'
            };
          }
          .modal-scroll {
            scrollbar-width: thin;
            scrollbar-color: ${
              theme === 'dark'
                ? 'rgba(75, 85, 99, 0.5) transparent'
                : 'rgba(147, 197, 253, 0.5) transparent'
            };
          }
        `}</style>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default AiSummaryModal;