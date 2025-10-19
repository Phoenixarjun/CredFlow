import React, { useState } from 'react';
import { Button, Flex, Text, TextField } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '@/features/authentication/context/AuthContext';
import { validateEmail } from '@/utils/validators'; 
import { navigateToUserDashboard } from '@/utils/navigation'; 
import ErrorDisplay from '@/components/ui/ErrorDisplay';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); 
    
    const { login, loading } = useAuth();
    const navigate = useNavigate(); 

    const validate = () => {
        const errors = {};
        const emailError = validateEmail(email);
        if (emailError) {
            errors.email = emailError;
        }
        if (!password) {
            errors.password = "Password is required";
        }
        return errors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setApiError('');
        setFieldErrors({});

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setFieldErrors(validationErrors);
            return;
        }

        try {
            const loggedInUser = await login(email, password);

            setSuccessMessage('Login Successful! Redirecting...');

            setTimeout(() => {
                navigateToUserDashboard(loggedInUser, navigate);
            }, 2000);

        } catch (err) {
            setApiError(err.response?.data?.message || 'Login failed. Please check your credentials.'); 
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
                            <Text as="div" size="2" weight="bold" mb="1" className="text-text-primary">Password</Text>
                            <TextField.Root 
                                type="password" 
                                placeholder="Enter your password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                color={fieldErrors.password ? 'red' : 'gray'}
                            />
                            {fieldErrors.password && <Text color="red" size="1" mt="1">{fieldErrors.password}</Text>}
                        </label>

                        {apiError && (<ErrorDisplay message={apiError} />)}

                        <Button 
                            type="submit" 
                            size="3" 
                            disabled={loading || !!successMessage} 
                            className="w-full credflow-gradient text-white font-bold mt-2"
                        >
                            {loading ? 'Logging in...' : 'Log In'}
                        </Button>
                    </>
                )}
            </Flex>
        </form>
    );
}

export default LoginForm;