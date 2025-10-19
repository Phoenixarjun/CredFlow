import React from 'react';
import { Flex, Heading, Text, Button } from '@radix-ui/themes';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@radix-ui/react-icons';

const NotFoundPage = () => {
    return (
        <Flex 
            align="center" 
            justify="center" 
            className="w-full h-screen bg-background"
        >
            <div className="max-w-4xl w-full bg-surface border-0 shadow-none">
                <Flex direction="row" align="center" justify="center" gap="8">
                    {/* 404 Image */}
                    <div className="flex-1">
                        <img 
                            src="/NotFound.png"
                            alt="Page Not Found"
                            className="w-full max-w-md" 
                        />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <Flex direction="column" align="start" gap="4">
                            
                            <Heading size="5" className="text-text-primary">
                                Page Not Found
                            </Heading>
                            
                            <Text 
                                size="3" 
                                className="text-text-secondary leading-relaxed"
                            >
                                Sorry, the page you are looking for does not exist 
                                or has been moved.
                            </Text>
                            
                            {/* Action Button */}
                            <Button 
                                asChild 
                                size="3" 
                                className="bg-gradient-to-r from-primary-start to-primary-end text-white hover:opacity-90 transition-opacity duration-200"
                            >
                                <Link to="/" className="flex items-center gap-2">
                                    <ArrowLeftIcon />
                                    Go Back Home
                                </Link>
                            </Button>
                        </Flex>
                    </div>
                </Flex>
            </div>
        </Flex>
    );
};

export default NotFoundPage;