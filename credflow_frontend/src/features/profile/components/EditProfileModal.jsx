import React, { useState, useEffect } from 'react';
import {
  Dialog,
  Flex,
  Text,
  Button,
  TextField,
  TextArea, // Use TextArea for address
  Grid,
} from '@radix-ui/themes';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Define Zod schema for validation, matching backend DTO constraints
const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100, "Full name cannot exceed 100 characters"),
  phoneNumber: z.string().max(15, "Phone number cannot exceed 15 characters").optional().or(z.literal('')), // Optional
  companyName: z.string().max(100, "Company name cannot exceed 100 characters").optional().or(z.literal('')), // Optional for non-customers/initial state
  address: z.string().max(500, "Address cannot exceed 500 characters").optional().or(z.literal('')), // Optional
  contactPerson: z.string().max(100, "Contact person cannot exceed 100 characters").optional().or(z.literal('')), // Optional
});

const EditProfileModal = ({ isOpen, onClose, profileData, onSave, isUpdating, isCustomer }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      companyName: '',
      address: '',
      contactPerson: '',
    },
  });

  // Reset form when profileData changes (e.g., when modal opens)
  useEffect(() => {
    if (profileData) {
      reset({
        fullName: profileData.fullName || '',
        phoneNumber: profileData.phoneNumber || '',
        companyName: profileData.companyName || '',
        address: profileData.address || '',
        contactPerson: profileData.contactPerson || '',
      });
    }
  }, [profileData, reset, isOpen]); // Depend on isOpen to reset when modal re-opens

  const onSubmit = (data) => {
    // Filter out empty strings before sending if backend expects nulls
    const payload = Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== '') { // Only include non-empty fields
            acc[key] = value;
        }
        return acc;
    }, {});
    onSave(payload);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content style={{ maxWidth: 550 }}>
        <Dialog.Title>Edit Profile</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Update your personal and company information.
        </Dialog.Description>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="4">
            {/* Use Grid for better layout */}
            <Grid columns={{ initial: '1', sm: '2' }} gap="3">
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium" htmlFor="fullName">Full Name</Text>
                <Controller
                  name="fullName"
                  control={control}
                  render={({ field }) => (
                    <TextField.Root
                      id="fullName"
                      placeholder="Enter your full name"
                      size="2"
                      color={errors.fullName ? 'red' : undefined}
                      {...field}
                    />
                  )}
                />
                {errors.fullName && <Text size="1" color="red">{errors.fullName.message}</Text>}
              </Flex>

              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium" htmlFor="phoneNumber">Phone Number</Text>
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <TextField.Root
                      id="phoneNumber"
                      placeholder="Enter phone number"
                      size="2"
                      color={errors.phoneNumber ? 'red' : undefined}
                      {...field}
                    />
                  )}
                />
                 {errors.phoneNumber && <Text size="1" color="red">{errors.phoneNumber.message}</Text>}
              </Flex>
            </Grid> {/* End Grid */}

             {/* Customer-specific fields */}
            {isCustomer && (
              <>
                 <Grid columns={{ initial: '1', sm: '2' }} gap="3">
                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium" htmlFor="companyName">Company Name</Text>
                    <Controller
                      name="companyName"
                      control={control}
                      render={({ field }) => (
                        <TextField.Root
                          id="companyName"
                          placeholder="Enter company name"
                          size="2"
                          color={errors.companyName ? 'red' : undefined}
                          {...field}
                        />
                      )}
                    />
                    {errors.companyName && <Text size="1" color="red">{errors.companyName.message}</Text>}
                  </Flex>
                  
                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium" htmlFor="contactPerson">Contact Person</Text>
                     <Controller
                      name="contactPerson"
                      control={control}
                      render={({ field }) => (
                        <TextField.Root
                          id="contactPerson"
                          placeholder="Enter contact person name"
                          size="2"
                          color={errors.contactPerson ? 'red' : undefined}
                          {...field}
                        />
                      )}
                    />
                     {errors.contactPerson && <Text size="1" color="red">{errors.contactPerson.message}</Text>}
                  </Flex>
                </Grid> {/* End Grid */}

                 <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium" htmlFor="address">Address</Text>
                    <Controller
                      name="address"
                      control={control}
                      render={({ field }) => (
                        <TextArea
                          id="address"
                          placeholder="Enter company address"
                          size="2"
                          color={errors.address ? 'red' : undefined}
                          style={{ minHeight: 80 }} // Give address field more height
                          {...field}
                        />
                      )}
                    />
                    {errors.address && <Text size="1" color="red">{errors.address.message}</Text>}
                  </Flex>
              </>
            )} {/* End isCustomer check */}

          </Flex> {/* End Form Fields Flex */}

          <Flex gap="3" mt="5" justify="end">
            <Button variant="soft" color="gray" onClick={onClose} type="button" disabled={isUpdating}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default EditProfileModal;