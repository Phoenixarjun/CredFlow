import React, { useEffect } from 'react';
import { Dialog, Flex, Button, Text, Switch, Heading, Grid, TextField } from '@radix-ui/themes';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormRow from '@/components/common/FormRow';
import FormSelect from '@/components/common/FormSelect';

// Define available roles (adjust if your RoleName enum differs)
const RoleOptions = [
    { value: 'CUSTOMER', label: 'Customer' },
    { value: 'BPO_AGENT', label: 'BPO Agent' },
    { value: 'ADMIN', label: 'Admin' },
];

// --- Validation Schema ---
const createUserSchema = yup.object().shape({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    fullName: yup.string().required('Full name is required'),
    phoneNumber: yup.string().nullable(),
    roleName: yup.string().required('Role is required'),
    isActive: yup.boolean(),
});

const updateUserSchema = yup.object().shape({
    email: yup.string().email('Invalid email format').required('Email is required'),
    // Password is NOT included in the update schema
    fullName: yup.string().required('Full name is required'),
    phoneNumber: yup.string().nullable(),
    roleName: yup.string().required('Role is required'),
    isActive: yup.boolean(),
});


const UserFormModal = ({ isOpen, onClose, onSave, user, isSubmitting }) => {
    const isEditing = Boolean(user);

    // Choose the correct schema based on mode
    const schema = isEditing ? updateUserSchema : createUserSchema;

    const { control, handleSubmit, reset, formState: { errors }, watch } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            email: '',
            password: '', // Only used for create
            fullName: '',
            phoneNumber: '',
            roleName: 'CUSTOMER', // Default role
            isActive: true,
        }
    });

    // Load user data into form when editing
    useEffect(() => {
        if (isEditing && user) {
            reset({
                email: user.email,
                password: '', // Clear password field when editing
                fullName: user.fullName,
                phoneNumber: user.phoneNumber || '',
                roleName: user.roleName,
                isActive: user.isActive,
            });
        } else {
            // Reset to defaults for create mode or when closing
             reset({
                email: '',
                password: '',
                fullName: '',
                phoneNumber: '',
                roleName: 'CUSTOMER',
                isActive: true,
            });
        }
    }, [isOpen, isEditing, user, reset]);

    const onSubmit = (data) => {
        // Remove password from data if we are editing
        const payload = isEditing ? { ...data, password: undefined } : data;
        onSave(payload);
    };
    
    // Watch isActive value to update text next to switch
    const isActiveValue = watch('isActive'); 

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Content style={{ maxWidth: 550 }}>
                <Dialog.Title>
                    {isEditing ? 'Edit User' : 'Create New User'}
                </Dialog.Title>
                <Dialog.Description>
                    {isEditing ? `Editing "${user?.email || ''}"` : 'Define a new user account.'}
                </Dialog.Description>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Flex direction="column" gap="4" mt="4">

                        <FormRow label="Email Address" error={errors.email?.message}>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <TextField.Root {...field} type="email" placeholder="user@example.com" size="2" color={errors.email ? 'red' : undefined} />
                                )}
                            />
                        </FormRow>
                        
                        {/* Only show password field when CREATING */}
                        {!isEditing && (
                            <FormRow label="Password" error={errors.password?.message}>
                                <Controller
                                    name="password"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField.Root {...field} type="password" placeholder="Min. 6 characters" size="2" color={errors.password ? 'red' : undefined} />
                                    )}
                                />
                            </FormRow>
                        )}

                        <Grid columns="2" gap="3">
                            <FormRow label="Full Name" error={errors.fullName?.message}>
                                <Controller
                                    name="fullName"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField.Root {...field} placeholder="John Doe" size="2" color={errors.fullName ? 'red' : undefined} />
                                    )}
                                />
                            </FormRow>
                            <FormRow label="Phone Number (Optional)" error={errors.phoneNumber?.message}>
                                <Controller
                                    name="phoneNumber"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField.Root {...field} placeholder="+1234567890" size="2" color={errors.phoneNumber ? 'red' : undefined} />
                                    )}
                                />
                            </FormRow>
                        </Grid>
                        
                        <Grid columns="2" gap="3">
                             <FormRow label="Role" error={errors.roleName?.message}>
                                <FormSelect
                                    name="roleName"
                                    control={control}
                                    options={RoleOptions}
                                />
                            </FormRow>
                            <FormRow label="Account Status">
                                <Controller
                                    name="isActive"
                                    control={control}
                                    render={({ field }) => (
                                        <Flex gap="2" align="center" pt="1">
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                            {/* Use the watched value here */}
                                            <Text size="2">{isActiveValue ? 'Active' : 'Inactive'}</Text> 
                                        </Flex>
                                    )}
                                />
                            </FormRow>
                        </Grid>

                        <Flex gap="3" mt="4" justify="end">
                            <Dialog.Close>
                                <Button variant="soft" color="gray" type="button" onClick={() => reset()}> {/* Reset form on cancel */}
                                    Cancel
                                </Button>
                            </Dialog.Close>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create User')}
                            </Button>
                        </Flex>
                    </Flex>
                </form>
            </Dialog.Content>
        </Dialog.Root>
    );
};

export default UserFormModal;