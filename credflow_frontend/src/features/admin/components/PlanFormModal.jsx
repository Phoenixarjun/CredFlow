import React, { useState, useEffect } from 'react';
import { Dialog, Flex, Button, Text, Switch, Heading, Grid, TextField } from '@radix-ui/themes';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AccountTypes, PlanTypes } from '@/enums/dunningEnums';
import FormRow from '@/components/common/FormRow';
import FormSelect from '@/components/common/FormSelect';

// --- Validation Schema ---
const planSchema = yup.object().shape({
    planName: yup.string().required('Plan name is required'),
    type: yup.string().required('Account type is required'),
    planType: yup.string().required('Plan type is required'),
    defaultSpeed: yup.string().required('Default speed is required'),
    price: yup.number()
        .typeError('Price must be a number')
        .positive('Price must be positive')
        .required('Price is required'),
    active: yup.boolean(), // <-- 1. RENAMED from isActive
});

// --- Modal Component ---
const PlanFormModal = ({ isOpen, onClose, onSave, plan, isSubmitting }) => {
    const isEditing = Boolean(plan);

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(planSchema),
        defaultValues: {
            planName: '',
            type: 'BROADBAND',
            planType: 'POSTPAID',
            defaultSpeed: '100mbps',
            price: 0.00,
            active: true, // <-- 2. RENAMED from isActive
        }
    });

    // Load plan data into form when in "Edit" mode
    useEffect(() => {
        if (isEditing && plan) {
            reset({
                planName: plan.planName,
                type: plan.type,
                planType: plan.planType,
                defaultSpeed: plan.defaultSpeed,
                price: plan.price,
                active: plan.active, // <-- 3. RENAMED from isActive
            });
        } else {
            // Reset to defaults when "Create" mode
            reset({
                planName: '',
                type: 'BROADBAND',
                planType: 'POSTPAID',
                defaultSpeed: '100mbps',
                price: 0.00,
                active: true, // Also renamed here
            });
        }
    }, [isOpen, isEditing, plan, reset]);

    const onSubmit = (data) => {
        onSave(data);
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Content style={{ maxWidth: 550 }}>
                <Dialog.Title>
                    {isEditing ? 'Edit Plan' : 'Create New Plan'}
                </Dialog.Title>
                <Dialog.Description>
                    {isEditing ? `Editing "${plan?.planName || ''}"` : 'Define a new service plan.'}
                </Dialog.Description>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Flex direction="column" gap="4" mt="4">

                        {/* ... (Other fields are correct) ... */}
                        <FormRow label="Plan Name" error={errors.planName?.message}>
                            <Controller
                                name="planName"
                                control={control}
                                render={({ field }) => (
                                    <TextField.Root {...field} placeholder="e.g., 'Fiber 100'" size="2" color={errors.planName ? 'red' : undefined} />
                                )}
                            />
                        </FormRow>
                        <Grid columns="2" gap="3">
                            <FormRow label="Account Type" error={errors.type?.message}>
                                <FormSelect name="type" control={control} options={AccountTypes} />
                            </FormRow>
                            <FormRow label="Plan Type" error={errors.planType?.message}>
                                <FormSelect name="planType" control={control} options={PlanTypes} />
                            </FormRow>
                        </Grid>
                        <Grid columns="2" gap="3">
                            <FormRow label="Default Speed" error={errors.defaultSpeed?.message}>
                                <Controller
                                    name="defaultSpeed"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField.Root {...field} placeholder="e.g., '100mbps'" size="2" color={errors.defaultSpeed ? 'red' : undefined} />
                                    )}
                                />
                            </FormRow>
                            <FormRow label="Price ($)" error={errors.price?.message}>
                                <Controller
                                    name="price"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField.Root {...field} type="number" step="0.01" placeholder="e.g., 59.99" size="2" color={errors.price ? 'red' : undefined} />
                                    )}
                                />
                            </FormRow>
                        </Grid>
                        
                        <FormRow label="Status">
                             <Controller
                                name="active" // <-- 4. RENAMED from isActive
                                control={control}
                                render={({ field }) => (
                                    <Flex gap="2" align="center" pt="1">
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                        <Text size="2">{field.value ? 'Active' : 'Inactive'}</Text>
                                    </Flex>
                                )}
                            />
                        </FormRow>

                        <Flex gap="3" mt="4" justify="end">
                            <Dialog.Close>
                                <Button variant="soft" color="gray" type="button">
                                    Cancel
                                </Button>
                            </Dialog.Close>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Plan')}
                            </Button>
                        </Flex>
                    </Flex>
                </form>
            </Dialog.Content>
        </Dialog.Root>
    );
};

export default PlanFormModal;