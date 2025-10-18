// in: src/utils/navigation.js

/**
 * Navigates to the correct dashboard based on the user's role.
 * @param {object} user - The user object from AuthContext
 * @param {function} navigate - The navigate function from useNavigate()
 */
export const navigateToUserDashboard = (user, navigate) => {
    switch (user.roleName) {
        case 'ADMIN':
            navigate('/admin/dashboard');
            break;
        case 'CUSTOMER':
            navigate('/customer/status');
            break;
        case 'BPO_AGENT':
            navigate('/bpo/tasks');
            break;
        default:
            navigate('/');
    }
};