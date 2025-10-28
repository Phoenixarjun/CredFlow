import React, { useState, useEffect } from 'react';
import { Dialog, Flex, Button, Text, Heading, TextArea } from "@radix-ui/themes";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Channel } from '@/enums/channelEnum';
import { FiZap } from 'react-icons/fi';
import AiGenerateModal from './AiGenerateModal';

const templateSchema = z.object({
  templateName: z.string().min(1, "Template Name is required.").max(100, "Name cannot exceed 100 characters"),
  channel: z.nativeEnum(Channel, { errorMap: () => ({ message: "Channel is required." }) }),
  subject: z.string().max(255, "Subject cannot exceed 255 characters").optional(),
  body: z.string().min(1, "Body cannot be empty."),
}).superRefine((data, ctx) => {
  if (data.channel === Channel.EMAIL && (!data.subject || data.subject.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['subject'],
      message: "Subject is required for Email templates.",
    });
  }
});

const FormRow = ({ label, htmlFor, error, children, isRequired }) => (
  <Flex direction="column" gap="1">
    <Text as="label" size="2" weight="medium" mb="1" htmlFor={htmlFor}>
      {label} {isRequired && <span className="text-red-500">*</span>}
    </Text>
    {children}
    {error && <Text size="1" color="red" mt="1">{error.message}</Text>}
  </Flex>
);

const inputClassName = (hasError) =>
  `w-full rounded-md border px-3 py-2 text-sm transition-colors duration-200 bg-[var(--color-background)] text-[var(--gray-12)] placeholder:text-[var(--gray-9)] ${hasError ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-[var(--gray-7)] hover:border-[var(--gray-8)] focus:border-[var(--accent-9)] focus:ring-1 focus:ring-[var(--accent-9)]"}`;

const selectClassName = (hasError) =>
  `w-full appearance-none rounded-md border bg-[var(--color-background)] px-3 py-2 pr-8 text-sm transition-colors duration-200 text-[var(--gray-12)] dark:bg-[var(--gray-3)] ${hasError ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-[var(--gray-7)] hover:border-[var(--gray-8)] focus:border-[var(--accent-9)] focus:ring-1 focus:ring-[var(--accent-9)]"} bg-no-repeat bg-[right_0.5rem_center] bg-[length:1em_1em] [background-image:url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M4.22%206.22a.75.75%200%200%201%201.06%200L8%208.94l2.72-2.72a.75.75%200%201%201%201.06%201.06l-3.25%203.25a.75.75%200%200%201-1.06%200L4.22%207.28a.75.75%200%200%201%200-1.06Z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E')] dark:[background-image:url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22%23d1d5db%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M4.22%206.22a.75.75%200%200%201%201.06%200L8%208.94l2.72-2.72a.75.75%200%201%201%201.06%201.06l-3.25%203.25a.75.75%200%200%201-1.06%200L4.22%207.28a.75.75%200%200%201%200-1.06Z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E')]`;

// Receive generateTemplateAi prop
const TemplateFormModal = ({ isOpen, onClose, onSave, template, isSaving, generateTemplateAi }) => {
  const isEditing = Boolean(template);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      templateName: '',
      channel: Channel.EMAIL,
      subject: '',
      body: '',
    },
  });

  const selectedChannel = watch('channel');

  useEffect(() => {
    if (isOpen) {
      if (template) {
        reset({
          templateName: template.templateName || '',
          channel: template.channel || Channel.EMAIL,
          subject: template.subject || '',
          body: template.body || '',
        });
      } else {
        reset({
          templateName: '',
          channel: Channel.EMAIL,
          subject: '',
          body: '',
        });
      }
    }
  }, [isOpen, template, reset]);

  const onSubmit = (data) => {
    console.log("Submitting Template Data:", data);
    onSave(data);
  };

  const handleApplyAiContent = (subject, body) => {
    console.log("Applying AI Content:", { subject, body });
    if (selectedChannel === Channel.EMAIL && subject) {
        setValue('subject', subject, { shouldValidate: true });
    }
    setValue('body', body, { shouldValidate: true });
  };

  const isBusy = isSaving;

  // Add a log inside the component to check the received prop
  console.log("TemplateFormModal Render - generateTemplateAi type:", typeof generateTemplateAi);

  return (
    <>
      <Dialog.Root open={isOpen} onOpenChange={onClose}>
        <Dialog.Content style={{ maxWidth: 650 }}>
          <Dialog.Title>
            {isEditing ? "Edit Notification Template" : "Create New Template"}
          </Dialog.Title>
          <Dialog.Description>
            {isEditing ? `Editing "${template?.templateName || ""}"` : "Define content for Email or SMS notifications."}
          </Dialog.Description>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Flex direction="column" gap="4" mt="4">

              <FormRow label="Template Name" htmlFor="templateName" error={errors.templateName} isRequired>
                <Controller
                  name="templateName"
                  control={control}
                  render={({ field }) => (
                    <input
                      id="templateName"
                      type="text"
                      placeholder="e.g., 'SMS Overdue Reminder 1'"
                      className={inputClassName(!!errors.templateName)}
                      {...field}
                      disabled={isBusy}
                    />
                  )}
                />
              </FormRow>

              <FormRow label="Channel" htmlFor="channel" error={errors.channel} isRequired>
                <Controller
                  name="channel"
                  control={control}
                  render={({ field }) => (
                    <select
                      id="channel"
                      className={selectClassName(!!errors.channel)}
                      {...field}
                      disabled={isBusy}
                    >
                      {Object.values(Channel).map((channelValue) => (
                        <option key={channelValue} value={channelValue}>
                          {channelValue}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </FormRow>

              {selectedChannel === Channel.EMAIL && (
                <FormRow label="Subject" htmlFor="subject" error={errors.subject} isRequired={selectedChannel === Channel.EMAIL}>
                  <Controller
                    name="subject"
                    control={control}
                    render={({ field }) => (
                      <input
                        id="subject"
                        type="text"
                        placeholder="Email Subject Line"
                        className={inputClassName(!!errors.subject)}
                        {...field}
                        disabled={isBusy}
                      />
                    )}
                  />
                </FormRow>
              )}

              <FormRow label="Body" htmlFor="body" error={errors.body} isRequired>
                 <Flex justify="end" mb="1">
                      <Button
                          type="button"
                          variant="outline"
                          size="1"
                          onClick={() => setIsAiModalOpen(true)}
                          disabled={isBusy}
                          color="violet"
                      >
                          <FiZap size={12} style={{ marginRight: '4px' }}/> Generate with AI
                      </Button>
                 </Flex>
                 <Controller
                  name="body"
                  control={control}
                  render={({ field }) => (
                    <TextArea
                      id="body"
                      placeholder={`Enter content manually or use 'Generate with AI'. Placeholders: {{userName}}, {{invoiceNumber}}, etc.`}
                      className={inputClassName(!!errors.body)}
                      style={{ minHeight: '150px', resize: 'vertical' }}
                      {...field}
                      disabled={isBusy}
                    />
                  )}
                 />
                 <Text size="1" color="gray">
                   Placeholders: {`{{userName}}, {{invoiceNumber}}, {{amountDue}}, {{dueDate}}, {{accountNumber}}`}
                 </Text>
              </FormRow>

              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <Button variant="soft" color="gray" type="button" disabled={isBusy}>Cancel</Button>
                </Dialog.Close>
                <Button type="submit" disabled={isBusy}>
                  {isBusy ? 'Processing...' : (isEditing ? "Save Changes" : "Create Template")}
                </Button>
              </Flex>
            </Flex>
          </form>
        </Dialog.Content>
      </Dialog.Root>

      {/* Pass the received generateTemplateAi prop down as generateAction */}
      <AiGenerateModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApplyContent={handleApplyAiContent}
        channel={selectedChannel}
        generateAction={generateTemplateAi} // <<< PASS THE PROP
      />
    </>
  );
};

export default TemplateFormModal;