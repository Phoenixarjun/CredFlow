import React, { useState, useEffect, useMemo } from "react"; 
import { Dialog, Flex, Button, Text, Switch, Heading } from "@radix-ui/themes";

import {
  DunningConditionTypes,
  DunningActionTypes,
  BpoPriorities,
  AccountTypes,
  PlanTypeOptions,
} from "@/enums/dunningEnums"; 

const FormRow = ({ label, htmlFor, error, children }) => (
  <Flex direction="column" gap="1">
    <Text as="label" size="2" weight="medium" mb="1" htmlFor={htmlFor}>
      {label}
    </Text>
    {children}
    {error && (
      <Text size="1" color="red" mt="1">
        {error}
      </Text>
    )}
  </Flex>
);

// --- inputClassName helper ---
const inputClassName = (hasError) =>
  `w-full rounded-md border px-3 py-2 text-sm transition-colors duration-200
     bg-[var(--color-background)]
     text-[var(--gray-12)]
     placeholder:text-[var(--gray-9)]
     ${
       hasError
         ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
         : "border-[var(--gray-7)] hover:border-[var(--gray-8)] focus:border-[var(--accent-9)] focus:ring-1 focus:ring-[var(--accent-9)]"
     }`;

// --- selectClassName helper ---
const selectClassName = (hasError) =>
  `w-full appearance-none rounded-md border bg-[var(--color-background)] px-3 py-2 pr-8 text-sm transition-colors duration-200
     text-[var(--gray-12)]
     dark:bg-[var(--gray-3)]
     ${
       hasError
         ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
         : "border-[var(--gray-7)] hover:border-[var(--gray-8)] focus:border-[var(--accent-9)] focus:ring-1 focus:ring-[var(--accent-9)]"
     }
    bg-no-repeat bg-[right_0.5rem_center] bg-[length:1em_1em]
    [background-image:url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M4.22%206.22a.75.75%200%200%201%201.06%200L8%208.94l2.72-2.72a.75.75%200%201%201%201.06%201.06l-3.25%203.25a.75.75%200%200%201-1.06%200L4.22%207.28a.75.75%200%200%201%200-1.06Z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E')]
    dark:[background-image:url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22%23d1d5db%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M4.22%206.22a.75.75%200%200%201%201.06%200L8%208.94l2.72-2.72a.75.75%200%201%201%201.06%201.06l-3.25%203.25a.75.75%200%200%201-1.06%200L4.22%207.28a.75.75%200%200%201%200-1.06Z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E')]`;

const RuleFormModal = ({ isOpen, onClose, onSave, rule, templates = [] }) => {
  const isEditing = Boolean(rule);

  const getInitialFormData = () => ({
    ruleName: rule?.ruleName || "",
    description: rule?.description || "",
    priority: rule?.priority ?? "",
    isActive: rule?.isActive ?? true,
    appliesToPlanType: rule?.appliesToPlanType || "ALL",
    conditionType: rule?.conditionType || "DAYS_OVERDUE",
    conditionValueInteger: rule?.conditionValueInteger ?? "",
    conditionValueDecimal: rule?.conditionValueDecimal ?? "",
    conditionValueString: rule?.conditionValueString || "MOBILE", // Default for ACCOUNT_TYPE
    actionType: rule?.actionType || "SEND_EMAIL",
    // Get templateId from the nested template object if editing, fallback to direct ID if exists (older data?)
    templateId: rule?.template?.templateId || rule?.templateId || "",
    bpoTaskPriority: rule?.bpoTaskPriority || "MEDIUM", // Default for CREATE_BPO_TASK
  });

  const [formData, setFormData] = useState(getInitialFormData());
  const [formErrors, setFormErrors] = useState({});

  console.log('Templates received in modal:', templates); // Log received templates
  console.log('Current Action Type:', formData.actionType); // Log current action selection

  // Reset form when modal opens or rule changes
  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData());
      setFormErrors({});
    }
  }, [isOpen, rule]); // Re-run when rule changes while modal is open (e.g., clicking edit again)


  // --- Filter templates based on selected action ---
  const filteredTemplates = useMemo(() => {
    if (formData.actionType === 'SEND_EMAIL') {
      return templates.filter(t => t.channel === 'EMAIL');
    }
    if (formData.actionType === 'SEND_SMS') {
       return templates.filter(t => t.channel === 'SMS');
    }
    return []; // No templates needed for other actions
  }, [formData.actionType, templates]);

  // Reset templateId if actionType changes and current templateId is no longer valid
  useEffect(() => {
      const currentTemplateIsValid = filteredTemplates.some(t => t.templateId === formData.templateId);
      if ((formData.actionType === 'SEND_EMAIL' || formData.actionType === 'SEND_SMS') && !currentTemplateIsValid) {
          handleChange('templateId', ''); // Reset if invalid
      }
  }, [formData.actionType, filteredTemplates, formData.templateId]);
  // ---------------------------------------------------


  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear validation error when user types
    if (formErrors[key]) {
      setFormErrors((prev) => ({ ...prev, [key]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.ruleName || formData.ruleName.trim() === "") {
      errors.ruleName = "Rule Name is required.";
    }
    const priorityNum = Number(formData.priority);
    if (formData.priority === "" || isNaN(priorityNum) || priorityNum < 1) {
      errors.priority = "Priority is required and must be a positive number (e.g., 10, 20).";
    }

    const conditionInt = Number(formData.conditionValueInteger);
    // --- Validation for DAYS_OVERDUE ---
    if (
      formData.conditionType === "DAYS_OVERDUE" &&
      (formData.conditionValueInteger === "" || isNaN(conditionInt) || conditionInt < 0)
    ) {
      errors.conditionValueInteger = "Days Overdue requires a number (0 or more).";
    }
    // --- Validation for DAYS_UNTIL_DUE ---
    if (
        formData.conditionType === "DAYS_UNTIL_DUE" &&
        (formData.conditionValueInteger === "" || isNaN(conditionInt) || conditionInt < 0)
    ) {
        // Technically can be 0 (due today), 1 (due tomorrow) etc.
        errors.conditionValueInteger = "Days Until Due requires a number (0 or more).";
    }
    // ------------------------------------

    const conditionDec = Number(formData.conditionValueDecimal);
    if (
      formData.conditionType === "MIN_AMOUNT_DUE" &&
      (formData.conditionValueDecimal === "" || isNaN(conditionDec) || conditionDec < 0)
    ) {
      errors.conditionValueDecimal = "Minimum Amount requires a number (0 or more).";
    }

    // --- Validation for templateId (Email OR SMS) ---
    if ((formData.actionType === "SEND_EMAIL" || formData.actionType === "SEND_SMS") && !formData.templateId) {
      errors.templateId = "Please select a notification template.";
    }
    // ---------------------------------------------

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    // --- Prepare data for saving ---
    const priorityValue = parseInt(formData.priority, 10);
    const conditionIntValue =
        (formData.conditionType === "DAYS_OVERDUE" || formData.conditionType === "DAYS_UNTIL_DUE") && formData.conditionValueInteger !== ""
        ? parseInt(formData.conditionValueInteger, 10)
        : null; // Use Integer for both day-based conditions

    const conditionDecimalValue =
        formData.conditionType === "MIN_AMOUNT_DUE" && formData.conditionValueDecimal !== ""
        ? parseFloat(formData.conditionValueDecimal)
        : null;

    const dataToSave = {
      ...formData,
      priority: priorityValue,
      appliesToPlanType: formData.appliesToPlanType, // Already correct ('ALL', 'PREPAID', 'POSTPAID')
      // Nullify condition values not relevant to the selected conditionType
      conditionValueInteger: conditionIntValue,
      conditionValueDecimal: conditionDecimalValue,
      conditionValueString:
        formData.conditionType === "ACCOUNT_TYPE"
          ? formData.conditionValueString
          : null,
      // Save templateId only if action is EMAIL or SMS
      templateId:
        (formData.actionType === "SEND_EMAIL" || formData.actionType === "SEND_SMS")
          ? formData.templateId
          : null,
      // Save bpoTaskPriority only if action is CREATE_BPO_TASK
      bpoTaskPriority:
        formData.actionType === "CREATE_BPO_TASK"
          ? formData.bpoTaskPriority
          : null,
    };

    // Remove the nested template object if it exists from editing
    delete dataToSave.template;

    console.log("Saving rule data:", dataToSave); // Debug log before save
    onSave(dataToSave);
  };

  // Helper to format numbers (like priority, days, amount) for input fields
  const formatNumberForInput = (value) =>
    value === null || value === undefined ? "" : String(value);

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content style={{ maxWidth: 550 }}>
        <Dialog.Title>
          {isEditing ? "Edit Dunning Rule" : "Create New Dunning Rule"}
        </Dialog.Title>
        <Dialog.Description>
          {isEditing
            ? `Editing "${rule?.ruleName || ""}"`
            : "Define a new rule for automated actions."}
        </Dialog.Description>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="4" mt="4">
            {/* Rule Name */}
            <FormRow label="Rule Name" htmlFor="ruleName" error={formErrors.ruleName}>
              <input
                id="ruleName" name="ruleName" type="text"
                value={formData.ruleName}
                onChange={(e) => handleChange("ruleName", e.target.value)}
                placeholder="e.g., 'Prepaid 1-Day Expiry SMS'"
                required aria-invalid={!!formErrors.ruleName}
                className={inputClassName(!!formErrors.ruleName)}
              />
            </FormRow>

            {/* Description */}
            <FormRow label="Description" htmlFor="description" error={formErrors.description}>
              <textarea
                id="description" name="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="What does this rule do?"
                rows={3}
                className={inputClassName(!!formErrors.description) + " min-h-[80px]"}
              />
            </FormRow>

            {/* Priority & Status */}
            <Flex gap="4">
              <div className="flex-1">
                <FormRow label="Priority" htmlFor="priority" error={formErrors.priority}>
                  <input
                    id="priority" name="priority" type="number"
                    value={formatNumberForInput(formData.priority)}
                    onChange={(e) => handleChange("priority", e.target.value)}
                    min={1} required aria-invalid={!!formErrors.priority}
                    className={inputClassName(!!formErrors.priority)}
                    placeholder="Lower numbers run first (e.g., 10)"
                  />
                </FormRow>
              </div>
              <div className="flex-1">
                <FormRow label="Status" htmlFor="isActive">
                  <Flex gap="2" align="center" pt="2">
                    <Switch
                      id="isActive" name="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => handleChange("isActive", checked)}
                    />
                    <Text size="2">{formData.isActive ? "Active" : "Inactive"}</Text>
                  </Flex>
                </FormRow>
              </div>
            </Flex>

            {/* Applies To Plan Type */}
            <FormRow label="Applies To Plan Type" htmlFor="appliesToPlanType" error={formErrors.appliesToPlanType}>
              <select
                id="appliesToPlanType" name="appliesToPlanType"
                value={formData.appliesToPlanType}
                onChange={(e) => handleChange("appliesToPlanType", e.target.value)}
                className={selectClassName(!!formErrors.appliesToPlanType)}
              >
                {PlanTypeOptions.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </FormRow>

            <hr className="border-[var(--gray-6)]" />
            <Heading size="3" color="gray">IF</Heading>

            {/* Condition Type */}
            <FormRow label="Condition Type" htmlFor="conditionType" error={formErrors.conditionType}>
              <select
                id="conditionType" name="conditionType"
                value={formData.conditionType}
                onChange={(e) => handleChange("conditionType", e.target.value)}
                className={selectClassName(!!formErrors.conditionType)}
              >
                {DunningConditionTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </FormRow>

            {/* Condition Value Inputs (Conditional) */}
            {formData.conditionType === "DAYS_OVERDUE" && (
              <FormRow label="Days Overdue Is >= " htmlFor="conditionValueInteger" error={formErrors.conditionValueInteger}>
                <input
                  id="conditionValueInteger" name="conditionValueInteger" type="number"
                  value={formatNumberForInput(formData.conditionValueInteger)}
                  onChange={(e) => handleChange("conditionValueInteger", e.target.value)}
                  min={0} placeholder="e.g., 7 (Triggers on Day 7+)"
                  aria-invalid={!!formErrors.conditionValueInteger}
                  className={inputClassName(!!formErrors.conditionValueInteger)}
                />
              </FormRow>
            )}
            {/* --- Input for DAYS_UNTIL_DUE --- */}
             {formData.conditionType === "DAYS_UNTIL_DUE" && (
              <FormRow label="Days Until Due Is <= " htmlFor="conditionValueInteger" error={formErrors.conditionValueInteger}>
                <input
                  id="conditionValueInteger" name="conditionValueInteger" type="number"
                  value={formatNumberForInput(formData.conditionValueInteger)}
                  onChange={(e) => handleChange("conditionValueInteger", e.target.value)}
                  min={0} placeholder="e.g., 1 (Triggers on Day 1 or Day 0)"
                  aria-invalid={!!formErrors.conditionValueInteger}
                  className={inputClassName(!!formErrors.conditionValueInteger)}
                />
              </FormRow>
            )}
            {/* ------------------------------- */}
            {formData.conditionType === "MIN_AMOUNT_DUE" && (
              <FormRow label="Amount Due Is >= ($)" htmlFor="conditionValueDecimal" error={formErrors.conditionValueDecimal}>
                <input
                  id="conditionValueDecimal" name="conditionValueDecimal" type="number" step="0.01"
                  value={formatNumberForInput(formData.conditionValueDecimal)}
                  onChange={(e) => handleChange("conditionValueDecimal", e.target.value)}
                  min={0} placeholder="e.g., 50.00"
                  aria-invalid={!!formErrors.conditionValueDecimal}
                  className={inputClassName(!!formErrors.conditionValueDecimal)}
                />
              </FormRow>
            )}
            {formData.conditionType === "ACCOUNT_TYPE" && (
              <FormRow label="Account Type Is" htmlFor="conditionValueString" error={formErrors.conditionValueString}>
                <select
                  id="conditionValueString" name="conditionValueString"
                  value={formData.conditionValueString}
                  onChange={(e) => handleChange("conditionValueString", e.target.value)}
                  className={selectClassName(!!formErrors.conditionValueString)}
                >
                  {AccountTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </FormRow>
            )}

            <hr className="border-[var(--gray-6)]" />
            <Heading size="3" color="gray">THEN</Heading>

            {/* Action Type */}
            <FormRow label="Action Type" htmlFor="actionType" error={formErrors.actionType}>
              <select
                id="actionType" name="actionType"
                value={formData.actionType}
                onChange={(e) => handleChange("actionType", e.target.value)}
                className={selectClassName(!!formErrors.actionType)}
              >
                {DunningActionTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </FormRow>

            {/* Action Specific Fields (Conditional) */}
            {/* --- Show Template for Email OR SMS --- */}
            {(formData.actionType === "SEND_EMAIL" || formData.actionType === "SEND_SMS") && (
              <FormRow label="Notification Template" htmlFor="templateId" error={formErrors.templateId}>
                <select
                  id="templateId" name="templateId"
                  value={formData.templateId}
                  onChange={(e) => handleChange("templateId", e.target.value)}
                  required={formData.actionType === "SEND_EMAIL" || formData.actionType === "SEND_SMS"} // Required for both
                  className={selectClassName(!!formErrors.templateId)}
                >
                  <option value="" disabled={formData.templateId !== ""}>
                    Select a template...
                  </option>
                  {/* Use filteredTemplates */}
                  {filteredTemplates.length > 0 ? (
                    filteredTemplates.map((template) => (
                      <option key={template.templateId} value={template.templateId}>
                        {template.templateName} ({template.channel})
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      {templates.length === 0 ? 'No templates loaded' : `No ${formData.actionType === 'SEND_SMS' ? 'SMS' : 'Email'} templates found`}
                    </option>
                  )}
                </select>
              </FormRow>
            )}
            {/* ------------------------------------- */}
            {formData.actionType === "CREATE_BPO_TASK" && (
              <FormRow label="BPO Task Priority" htmlFor="bpoTaskPriority" error={formErrors.bpoTaskPriority}>
                <select
                  id="bpoTaskPriority" name="bpoTaskPriority"
                  value={formData.bpoTaskPriority}
                  onChange={(e) => handleChange("bpoTaskPriority", e.target.value)}
                  className={selectClassName(!!formErrors.bpoTaskPriority)}
                >
                  {BpoPriorities.map((prio) => (
                    <option key={prio.value} value={prio.value}>{prio.label}</option>
                  ))}
                </select>
              </FormRow>
            )}

            {/* Buttons */}
            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray" type="button">Cancel</Button>
              </Dialog.Close>
              <Button type="submit">
                {isEditing ? "Save Changes" : "Create Rule"}
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default RuleFormModal;