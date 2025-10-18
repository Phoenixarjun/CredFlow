// in: src/features/authentication/components/LoginForm.jsx
import React, { useState } from 'react';
import { Button, Flex, Text, TextField } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom'; // <-- ADDED
import { useAuth } from '@/features/authentication/context/AuthContext';
import { validateEmail } from '@/utils/validators'; 
import { navigateToUserDashboard } from '@/utils/navigation'; // <-- ADDED

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // <-- ADDED
    
    const { login, loading } = useAuth();
    const navigate = useNavigate(); // <-- ADDED

    const validate = () => {
        // ... (your validation logic is perfect)
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
            // 1. Await the login and get the user
            const loggedInUser = await login(email, password);

            // 2. Set success message
            setSuccessMessage('Login Successful! Redirecting...');

            // 3. Wait 2 seconds, then navigate
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
                {/* --- This is the new part --- */}
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

                        {apiError && (<Text color="red" size="2" align="center">{apiError}</Text>)}

                        <Button 
                            type="submit" 
                            size="3" 
                            // Disable if loading OR if successful
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