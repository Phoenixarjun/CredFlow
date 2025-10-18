// in: src/utils/validators.js

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^\+?[0-9]{10,15}$/;

export const validateEmail = (email) => {
    if (!email) {
        return "Email is required";
    }
    if (!EMAIL_REGEX.test(email)) {
        return "Please enter a valid email address";
    }
    return ""; // No error
};

export const calculatePasswordStrength = (password) => {
    let score = 0;
    let label = '';
    let color = '';

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    switch (score) {
        case 0:
        case 1:
        case 2:
            label = 'Weak';
            color = 'red';
            break;
        case 3:
            label = 'Medium';
            color = 'yellow';
            break;
        case 4:
            label = 'Strong';
            color = 'green';
            break;
        case 5:
            label = 'Very Strong';
            color = 'green';
            break;
        default:
            label = 'Weak';
            color = 'red';
    }

    return { score, label, color };
};

// Main validator for the registration form
export const validateRegistration = ({ fullName, email, password, confirmPassword, phoneNumber }) => {
    const errors = {};

    if (!fullName) {
        errors.fullName = "Full name is required";
    } else if (fullName.length < 3) {
        errors.fullName = "Full name must be at least 3 characters";
    }

    const emailError = validateEmail(email);
    if (emailError) {
        errors.email = emailError;
    }
    
    if (!phoneNumber) {
        errors.phoneNumber = "Phone number is required";
    } else if (!PHONE_REGEX.test(phoneNumber)) {
        errors.phoneNumber = "Please enter a valid phone number";
    }

    if (!password) {
        errors.password = "Password is required";
    } else if (password.length < 8) {
        errors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
    } else if (password && password !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
    }

    return errors;
};