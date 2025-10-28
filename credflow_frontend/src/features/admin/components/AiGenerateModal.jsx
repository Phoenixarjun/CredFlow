import React, { useState } from 'react';
import { Dialog, Flex, Button, Text, Heading, TextArea, Callout } from "@radix-ui/themes";
import { InfoCircledIcon, LightningBoltIcon } from '@radix-ui/react-icons';

const inputClassName = (hasError) =>
  `w-full rounded-md border px-3 py-2 text-sm transition-colors duration-200 bg-[var(--color-background)] text-[var(--gray-12)] placeholder:text-[var(--gray-9)] ${hasError ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-[var(--gray-7)] hover:border-[var(--gray-8)] focus:border-[var(--accent-9)] focus:ring-1 focus:ring-[var(--accent-9)]"}`;

// Receive generateAction prop
const AiGenerateModal = ({ isOpen, onClose, onApplyContent, channel, generateAction }) => {
    const [purpose, setPurpose] = useState('');
    const [tone, setTone] = useState('Polite but firm');
    const [keyDetails, setKeyDetails] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Add log inside the component to check the received prop
    console.log("AiGenerateModal Render - generateAction type:", typeof generateAction);

    const handleGenerate = async () => {
        // --- ADD CHECK ---
        if (typeof generateAction !== 'function') {
            console.error("generateAction prop is not a function!", generateAction);
            setError("Internal error: AI generation function not available.");
            return; // Prevent attempting to call if it's not a function
        }
        // ---------------

        if (!purpose.trim()) {
            setError("Please describe the purpose of the template.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const requestData = {
                channel: channel,
                purpose: purpose.trim(),
                tone: tone.trim() || null,
                keyDetails: keyDetails.trim() || null,
            };
            console.log("Sending AI request:", requestData);
            const result = await generateAction(requestData); // Call the prop
            console.log("AI Result:", result);
            if (result && result.generatedBody) {
                onApplyContent(result.generatedSubject || '', result.generatedBody);
                handleClose();
            } else {
                 throw new Error("AI returned empty or invalid content.");
            }
        } catch (err) {
            console.error("AI Generation failed in modal:", err);
            const errMsg = err.message || "An unexpected error occurred during generation.";
            setError(errMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setPurpose('');
        setTone('Polite but firm');
        setKeyDetails('');
        setError(null);
        setIsLoading(false);
        onClose();
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={handleClose}>
            <Dialog.Content style={{ maxWidth: 550 }}>
                <Dialog.Title>
                    <Flex align="center" gap="2">
                        <LightningBoltIcon /> Generate Template with AI
                    </Flex>
                </Dialog.Title>
                <Dialog.Description>
                    Describe the goal of this notification. AI will suggest content including placeholders.
                </Dialog.Description>

                <Flex direction="column" gap="4" mt="4">
                    {error && (
                        <Callout.Root color="red" role="alert" size="1">
                            <Callout.Icon><InfoCircledIcon /></Callout.Icon>
                            <Callout.Text>{error}</Callout.Text>
                        </Callout.Root>
                    )}

                    <Text size="2">Channel: <Text weight="bold">{channel}</Text></Text>

                    <Flex direction="column" gap="1">
                        <Text as="label" htmlFor="ai-purpose" size="2" weight="medium">Purpose <span className="text-red-500">*</span></Text>
                        <TextArea
                            id="ai-purpose"
                            placeholder="e.g., Send a final warning SMS before service restriction due to non-payment. Mention the overdue amount and due date."
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            className={inputClassName(!purpose.trim() && !!error)}
                            style={{ minHeight: '100px' }}
                            disabled={isLoading}
                        />
                         {!purpose.trim() && error && <Text size="1" color="red" mt="1">Purpose is required.</Text>}
                    </Flex>

                    <Flex direction="column" gap="1">
                        <Text as="label" htmlFor="ai-tone" size="2" weight="medium">Desired Tone (Optional)</Text>
                         <input
                             id="ai-tone" type="text"
                             placeholder="e.g., Polite, Formal, Urgent but friendly"
                             value={tone}
                             onChange={(e) => setTone(e.target.value)}
                             className={inputClassName(false)}
                             disabled={isLoading}
                         />
                    </Flex>

                    <Flex direction="column" gap="1">
                        <Text as="label" htmlFor="ai-keyDetails" size="2" weight="medium">Key Details / Placeholders (Optional)</Text>
                        <TextArea
                            id="ai-keyDetails"
                            placeholder="e.g., Must mention {{invoiceNumber}}. Ask user to call 1-800-SUPPORT. Include company name 'CredFlow'."
                            value={keyDetails}
                            onChange={(e) => setKeyDetails(e.target.value)}
                            className={inputClassName(false)}
                            style={{ minHeight: '60px' }}
                            disabled={isLoading}
                        />
                        <Text size="1" color="gray">Specify details or extra placeholders AI should include.</Text>
                    </Flex>

                    <Flex gap="3" mt="4" justify="end">
                        <Button variant="soft" color="gray" type="button" onClick={handleClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="button" onClick={handleGenerate} disabled={isLoading || !purpose.trim()}>
                            {isLoading ? 'Generating...' : 'Generate Content'}
                        </Button>
                    </Flex>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};

export default AiGenerateModal;