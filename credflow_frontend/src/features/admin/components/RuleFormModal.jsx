import { React, useState, useEffect } from "react";
import { Dialog, Flex, Button, Text, Switch, Heading } from "@radix-ui/themes";

import {
  DunningConditionTypes,
  DunningActionTypes,
  BpoPriorities,
  AccountTypes,
  PlanTypeOptions,
} from "@/enums/dunningEnums";

// --- FormRow Component ---
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
    appliesToPlanType: rule?.appliesToPlanType || "ALL", // Use 'ALL' as default
    conditionType: rule?.conditionType || "DAYS_OVERDUE",
    conditionValueInteger: rule?.conditionValueInteger ?? "",
    conditionValueDecimal: rule?.conditionValueDecimal ?? "",
    conditionValueString: rule?.conditionValueString || "MOBILE",
    actionType: rule?.actionType || "SEND_EMAIL",
    templateId: rule?.template?.templateId || rule?.templateId || "",
    bpoTaskPriority: rule?.bpoTaskPriority || "MEDIUM",
  });

  const [formData, setFormData] = useState(getInitialFormData());
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData());
      setFormErrors({});
    }
  }, [isOpen, rule]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
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
      errors.priority = "Priority is required and must be at least 1.";
    }
    const conditionInt = Number(formData.conditionValueInteger);
    if (
      formData.conditionType === "DAYS_OVERDUE" &&
      (formData.conditionValueInteger === "" ||
        isNaN(conditionInt) ||
        conditionInt < 0)
    ) {
      errors.conditionValueInteger =
        "Please enter a valid number of days (0 or more).";
    }
    const conditionDec = Number(formData.conditionValueDecimal);
    if (
      formData.conditionType === "MIN_AMOUNT_DUE" &&
      (formData.conditionValueDecimal === "" ||
        isNaN(conditionDec) ||
        conditionDec < 0)
    ) {
      errors.conditionValueDecimal =
        "Please enter a valid minimum amount (0 or more).";
    }
    if (formData.actionType === "SEND_EMAIL" && !formData.templateId) {
      errors.templateId = "Please select a notification template.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    const priorityValue = parseInt(formData.priority, 10);
    const conditionIntValue =
      formData.conditionValueInteger === ""
        ? null
        : parseInt(formData.conditionValueInteger, 10);
    const conditionDecimalValue =
      formData.conditionValueDecimal === ""
        ? null
        : parseFloat(formData.conditionValueDecimal);

    const dataToSave = {
      ...formData,
      priority: priorityValue,
      appliesToPlanType: formData.appliesToPlanType, // Send 'ALL', 'PREPAID', or 'POSTPAID'
      conditionValueInteger:
        formData.conditionType === "DAYS_OVERDUE" ? conditionIntValue : null,
      conditionValueDecimal:
        formData.conditionType === "MIN_AMOUNT_DUE"
          ? conditionDecimalValue
          : null,
      conditionValueString:
        formData.conditionType === "ACCOUNT_TYPE"
          ? formData.conditionValueString
          : null,
      templateId:
        formData.actionType === "SEND_EMAIL" ? formData.templateId : null,
      bpoTaskPriority:
        formData.actionType === "CREATE_BPO_TASK"
          ? formData.bpoTaskPriority
          : null,
    };
    delete dataToSave.template; // Ensure template object is not sent
    onSave(dataToSave);
  };

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
            <FormRow
              label="Rule Name"
              htmlFor="ruleName"
              error={formErrors.ruleName}
            >
              <input
                id="ruleName"
                name="ruleName"
                type="text"
                value={formData.ruleName}
                onChange={(e) => handleChange("ruleName", e.target.value)}
                placeholder="e.g., 'Postpaid 7-Day Reminder'"
                required
                aria-invalid={!!formErrors.ruleName}
                className={inputClassName(!!formErrors.ruleName)}
              />
            </FormRow>

            <FormRow
              label="Description"
              htmlFor="description"
              error={formErrors.description}
            >
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="What does this rule do?"
                rows={3}
                className={
                  inputClassName(!!formErrors.description) + " min-h-[80px]"
                }
              />
            </FormRow>

            <Flex gap="4">
              <div className="flex-1">
                <FormRow
                  label="Priority"
                  htmlFor="priority"
                  error={formErrors.priority}
                >
                  <input
                    id="priority"
                    name="priority"
                    type="number"
                    value={formatNumberForInput(formData.priority)}
                    onChange={(e) => handleChange("priority", e.target.value)}
                    min={1}
                    required
                    aria-invalid={!!formErrors.priority}
                    className={inputClassName(!!formErrors.priority)}
                  />
                </FormRow>
              </div>
              <div className="flex-1">
                <FormRow label="Status" htmlFor="isActive">
                  <Flex gap="2" align="center" pt="2">
                    <Switch
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) =>
                        handleChange("isActive", checked)
                      }
                    />
                    <Text size="2">
                      {formData.isActive ? "Active" : "Inactive"}
                    </Text>
                  </Flex>
                </FormRow>
              </div>
            </Flex>

            <FormRow
              label="Applies To Plan Type"
              htmlFor="appliesToPlanType"
              error={formErrors.appliesToPlanType}
            >
              <select
                id="appliesToPlanType"
                name="appliesToPlanType"
                value={formData.appliesToPlanType}
                onChange={(e) =>
                  handleChange("appliesToPlanType", e.target.value)
                }
                className={selectClassName(!!formErrors.appliesToPlanType)}
              >
                {PlanTypeOptions.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </FormRow>

            <hr className="border-[var(--gray-6)]" />

            <Heading size="3" color="gray">
              IF
            </Heading>
            <FormRow
              label="Condition Type"
              htmlFor="conditionType"
              error={formErrors.conditionType}
            >
              <select
                id="conditionType"
                name="conditionType"
                value={formData.conditionType}
                onChange={(e) => handleChange("conditionType", e.target.value)}
                className={selectClassName(!!formErrors.conditionType)}
              >
                {DunningConditionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </FormRow>
            {formData.conditionType === "DAYS_OVERDUE" && (
              <FormRow
                label="Days Overdue Is >= "
                htmlFor="conditionValueInteger"
                error={formErrors.conditionValueInteger}
              >
                <input
                  id="conditionValueInteger"
                  name="conditionValueInteger"
                  type="number"
                  value={formatNumberForInput(formData.conditionValueInteger)}
                  onChange={(e) =>
                    handleChange("conditionValueInteger", e.target.value)
                  }
                  min={0}
                  placeholder="e.g., 7"
                  aria-invalid={!!formErrors.conditionValueInteger}
                  className={inputClassName(!!formErrors.conditionValueInteger)}
                />
              </FormRow>
            )}
            {formData.conditionType === "MIN_AMOUNT_DUE" && (
              <FormRow
                label="Amount Due Is >= ($)"
                htmlFor="conditionValueDecimal"
                error={formErrors.conditionValueDecimal}
              >
                <input
                  id="conditionValueDecimal"
                  name="conditionValueDecimal"
                  type="number"
                  step="0.01"
                  value={formatNumberForInput(formData.conditionValueDecimal)}
                  onChange={(e) =>
                    handleChange("conditionValueDecimal", e.target.value)
                  }
                  min={0}
                  placeholder="e.g., 50.00"
                  aria-invalid={!!formErrors.conditionValueDecimal}
                  className={inputClassName(!!formErrors.conditionValueDecimal)}
                />
              </FormRow>
            )}
            {formData.conditionType === "ACCOUNT_TYPE" && (
              <FormRow
                label="Account Type Is"
                htmlFor="conditionValueString"
                error={formErrors.conditionValueString}
              >
                <select
                  id="conditionValueString"
                  name="conditionValueString"
                  value={formData.conditionValueString}
                  onChange={(e) =>
                    handleChange("conditionValueString", e.target.value)
                  }
                  className={selectClassName(!!formErrors.conditionValueString)}
                >
                  {AccountTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </FormRow>
            )}

            <hr className="border-[var(--gray-6)]" />

            <Heading size="3" color="gray">
              THEN
            </Heading>
            <FormRow
              label="Action Type"
              htmlFor="actionType"
              error={formErrors.actionType}
            >
              <select
                id="actionType"
                name="actionType"
                value={formData.actionType}
                onChange={(e) => handleChange("actionType", e.target.value)}
                className={selectClassName(!!formErrors.actionType)}
              >
                {DunningActionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </FormRow>
            {formData.actionType === "SEND_EMAIL" && (
              <FormRow
                label="Notification Template"
                htmlFor="templateId"
                error={formErrors.templateId}
              >
                <select
                  id="templateId"
                  name="templateId"
                  value={formData.templateId}
                  onChange={(e) => handleChange("templateId", e.target.value)}
                  required={formData.actionType === "SEND_EMAIL"}
                  className={selectClassName(!!formErrors.templateId)}
                >
                  <option value="" disabled={formData.templateId !== ""}>
                    Select a template...
                  </option>
                  {templates.length > 0 ? (
                    templates.map((template) => (
                      <option
                        key={template.templateId}
                        value={template.templateId}
                      >
                        {template.templateName} (
                        {template.templateId.substring(0, 8)}...)
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      Loading templates...
                    </option>
                  )}
                </select>
              </FormRow>
            )}
            {formData.actionType === "CREATE_BPO_TASK" && (
              <FormRow
                label="BPO Task Priority"
                htmlFor="bpoTaskPriority"
                error={formErrors.bpoTaskPriority}
              >
                <select
                  id="bpoTaskPriority"
                  name="bpoTaskPriority"
                  value={formData.bpoTaskPriority}
                  onChange={(e) =>
                    handleChange("bpoTaskPriority", e.target.value)
                  }
                  className={selectClassName(!!formErrors.bpoTaskPriority)}
                >
                  {BpoPriorities.map((prio) => (
                    <option key={prio.value} value={prio.value}>
                      {prio.label}
                    </option>
                  ))}
                </select>
              </FormRow>
            )}

            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray" type="button">
                  Cancel
                </Button>
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
