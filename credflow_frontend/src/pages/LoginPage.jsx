import React from 'react';
import LoginForm from '../features/authentication/components/LoginForm';
import Footer from '../components/ui/Footer';
import Navbar from '../components/ui/Navbar';

const LoginPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex justify-center items-center bg-gray-50 pt-16">
        <LoginForm />
      </main>
      <Footer />
    </div>
  )
}

export default LoginPage
