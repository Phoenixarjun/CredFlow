import React from 'react';
import { Controller } from 'react-hook-form';
import { Select as RadixSelect } from '@radix-ui/themes';


const FormSelect = ({ control, name, options, placeholder, ...props }) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <RadixSelect.Root
                    value={field.value}
                    onValueChange={field.onChange}
                    {...props}
                >
                    <RadixSelect.Trigger
                        placeholder={placeholder}
                        color={fieldState.error ? 'red' : undefined}
                        className="w-full"
                    />
                    <RadixSelect.Content>
                        <RadixSelect.Group>
                            {options.map(option => (
                                <RadixSelect.Item
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </RadixSelect.Item>
                            ))}
                        </RadixSelect.Group>
                    </RadixSelect.Content>
                </RadixSelect.Root>
            )}
        />
    );
};

export default FormSelect;