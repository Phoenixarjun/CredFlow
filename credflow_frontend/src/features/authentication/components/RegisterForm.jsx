// in: src/features/authentication/components/RegisterForm.jsx
import React, { useState } from 'react';
import { Button, Flex, Text, TextField } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/authentication/context/AuthContext';
import { RoleName } from '@/enums/RoleName';
import { 
    validateRegistration, 
    calculatePasswordStrength 
} from '@/utils/validators'; 
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { navigateToUserDashboard } from '@/utils/navigation';

const RegisterForm = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [strength, setStrength] = useState({});
    const [fieldErrors, setFieldErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    const { register, loading } = useAuth();
    const navigate = useNavigate();

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setStrength(calculatePasswordStrength(newPassword));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setApiError('');
        setFieldErrors({});

        const validationErrors = validateRegistration({ fullName, email, password, confirmPassword, phoneNumber });
        
        if (Object.keys(validationErrors).length > 0) {
            setFieldErrors(validationErrors);
            return;
        }

        try {
            const registeredUser = await register({ 
                fullName, 
                email, 
                password, 
                phoneNumber, 
                roleName: RoleName.CUSTOMER 
            });

            setSuccessMessage('Account Created! Redirecting...');

            setTimeout(() => {
                navigateToUserDashboard(registeredUser, navigate);
            }, 2000);

        } catch (err) {
            setApiError(err.response?.data?.message || 'Registration failed. Please try again.'); 
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <Flex direction="column" gap="4">
                {successMessage ? (
                    <Text color="green" size="3" weight="bold" align="center">
                        {successMessage}
                    </Text>
                ) : (
                    <>
                        <label>
                            <Text as="div" size="2" weight="bold" mb="1" className="text-text-primary">Full Name</Text>
                            <TextField.Root 
                                type="text" 
                                placeholder="Enter your full name" 
                                value={fullName} 
                                onChange={(e) => setFullName(e.target.value)}
                                color={fieldErrors.fullName ? 'red' : 'gray'}
                            />
                            {fieldErrors.fullName && <Text color="red" size="1" mt="1">{fieldErrors.fullName}</Text>}
                        </label>
                        
                        <label>
                            <Text as="div" size="2" weight="bold" mb="1" className="text-text-primary">Email Address</Text>
                            <TextField.Root 
                                type="email" 
                                placeholder="Enter your email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                color={fieldErrors.email ? 'red' : 'gray'}
                            />
                            {fieldErrors.email && <Text color="red" size="1" mt="1">{fieldErrors.email}</Text>}
                        </label>
                        
                        <label>
                            <Text as="div" size="2" weight="bold" mb="1" className="text-text-primary">Phone Number</Text>
                            <TextField.Root 
                                type="tel" 
                                placeholder="Enter your phone number" 
                                value={phoneNumber} 
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                color={fieldErrors.phoneNumber ? 'red' : 'gray'}
                            />
                            {fieldErrors.phoneNumber && <Text color="red" size="1" mt="1">{fieldErrors.phoneNumber}</Text>}
                        </label>
                        
                        <label>
                            <Text as="div" size="2" weight="bold" mb="1" className="text-text-primary">Password</Text>
                            <TextField.Root 
                                type="password" 
                                placeholder="Create a password (min. 8 characters)" 
                                value={password} 
                                onChange={handlePasswordChange}
                                color={fieldErrors.password ? 'red' : 'gray'}
                            />
                            {fieldErrors.password ? (
                                <Text color="red" size="1" mt="1">{fieldErrors.password}</Text>
                            ) : (
                                <PasswordStrengthMeter strength={strength} />
                            )}
                        </label>
                        
                        <label>
                            <Text as="div" size="2" weight="bold" mb="1" className="text-text-primary">Confirm Password</Text>
                            <TextField.Root 
                                type="password" 
                                placeholder="Confirm your password" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                color={fieldErrors.confirmPassword ? 'red' : 'gray'}
                            />
                            {fieldErrors.confirmPassword && <Text color="red" size="1" mt="1">{fieldErrors.confirmPassword}</Text>}
                        </label>

                        {apiError && (<Text color="red" size="2" className="text-center">{apiError}</Text>)}

                        <Button 
                            type="submit" 
                            size="3" 
                            disabled={loading || !!successMessage}
                            className="w-full credflow-gradient text-white font-bold mt-2"
                        >
                            {loading ? 'Creating Account...' : 'Register'}
                        </Button>
                    </>
                )}
            </Flex>
        </form>
    );
};

export default RegisterForm;