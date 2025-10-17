import React, { useState } from 'react';
import { Button, Flex, Text, TextField } from '@radix-ui/themes';
import { useAuth } from '@/context/AuthContext';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, loading } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        try {
            await login(email, password);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.'); 
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <Flex direction="column" gap="4">
                <label>
                    <Text as="div" size="2" weight="bold" mb="1" className="text-text-primary">Email Address</Text>
                    <TextField.Root type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-background border-border" />
                </label>

                <label>
                    <Text as="div" size="2" weight="bold" mb="1" className="text-text-primary">Password</Text>
                    <TextField.Root type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-background border-border" />
                </label>

                {error && (<Text color="red" size="2" align="center">{error}</Text>)}

                <Button type="submit" size="3" disabled={loading} className="w-full credflow-gradient text-white font-bold mt-2">
                    {loading ? 'Logging in...' : 'Log In'}
                </Button>
            </Flex>
        </form>
    );
}

export default LoginForm;