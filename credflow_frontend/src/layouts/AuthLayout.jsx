import React from 'react';
import { Card, Flex, Grid, Heading, Text } from '@radix-ui/themes';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeProvider';
    
const AuthLayout = ({ children, formType }) => {
    const isLogin = formType === 'login';
    
    return (
            <Grid columns={{ initial: '1', md: '2' }} className="h-full w-full">
                <Flex align="center" justify="center" p="6" className="h-full">
                <Card size="4" className="w-full max-w-md bg-surface shadow-xl p-6 md:p-8">
                    <Flex direction="column" gap="5" align="center">
                        <h1 className="text-3xl font-bold credflow-gradient">CredFlow</h1>
                        
                        {children}

                        <Text size="2" className="text-text-secondary">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <Link to={isLogin ? "/register" : "/login"} className="text-primary-start hover:underline font-medium">
                                {isLogin ? "Register" : "Log In"}
                            </Link>
                        </Text>
                    </Flex>
                </Card>
            </Flex>

            <Flex align="center" justify="center" p="9" className="hidden md:flex credflow-gradient">
                <Flex direction="column" gap="4" className={`text-center ${
                    useTheme().theme === 'dark' ? 'text-white' : 'text-black'
                }`}>
                    <Heading size="8">Welcome to CredFlow</Heading>
                    <Text size="4">Streamlining credit management with intelligent automation.</Text>
                </Flex>
            </Flex>
        </Grid>
    );
};

export default AuthLayout;
