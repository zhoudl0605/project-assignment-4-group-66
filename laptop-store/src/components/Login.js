import React, { useState } from 'react';
import axios from 'axios';
import './LoginRegister.css';

function LoginRegister() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [address, setAddress] = useState({
        address1: '',
        address2: '',
        city: '',
        province: '',
        postalCode: '',
    });
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddressChange = (field, value) => {
        setAddress((prevAddress) => ({
            ...prevAddress,
            [field]: value,
        }));
    };

    const validateInputs = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const postalCodeRegex = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;

        if (!emailRegex.test(email)) return 'Invalid email format';
        if (!isLogin) {
            if (!name.trim()) return 'Name is required';
            if (!address.address1.trim()) return 'Address 1 is required';
            if (!address.city.trim()) return 'City is required';
            if (!address.province.trim()) return 'Province is required';
            if (!postalCodeRegex.test(address.postalCode)) return 'Invalid postal code format. Example: B4A 0G4';
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const validationError = validateInputs();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setIsSubmitting(true);
            
            const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';
            if (isLogin) {
                const response = await axios.post(`${baseUrl}/auth/login`, { email, password });
                localStorage.setItem('token', response.data.data.token);
                window.location.href = '/';
            } else {
                const response = await axios.post(`${baseUrl}/auth/signup`, {
                    name,
                    email,
                    password,
                    address,
                });

                localStorage.setItem('token', response.data.data.token);
                // Redirect to home page
                window.location.href = '/';
            }
        } catch (error) {
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError(`An unexpected error occurred: ${error.message}`);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-register-container">
            <h2>{isLogin ? 'Login' : 'Register'}</h2>
            {error && <div className="error-message">{error}</div>}
            <form className="login-register-form" onSubmit={handleSubmit}>

                <input
                    type="email"
                    placeholder="Email*"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                />
                <input
                    type="password"
                    placeholder="Password*"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                />
                {!isLogin && (
                    <>
                        <input
                            type="text"
                            placeholder="Name*"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-input"
                        />
                        <input
                            type="text"
                            placeholder="Address 1*"
                            value={address.address1}
                            onChange={(e) => handleAddressChange('address1', e.target.value)}
                            className="form-input"
                        />
                        <input
                            type="text"
                            placeholder="Address 2"
                            value={address.address2}
                            onChange={(e) => handleAddressChange('address2', e.target.value)}
                            className="form-input"
                        />
                        <input
                            type="text"
                            placeholder="City*"
                            value={address.city}
                            onChange={(e) => handleAddressChange('city', e.target.value)}
                            className="form-input"
                        />
                        <input
                            type="text"
                            placeholder="Province*"
                            value={address.province}
                            onChange={(e) => handleAddressChange('province', e.target.value)}
                            className="form-input"
                        />
                        <input
                            type="text"
                            placeholder="Postal Code*"
                            value={address.postalCode}
                            onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                            className="form-input"
                        />
                    </>
                )}
                <button type="submit" className="form-button" disabled={isSubmitting}>
                    {isLogin ? 'Login' : 'Register'}
                </button>
            </form>
            <button className="toggle-button" onClick={() => setIsLogin(!isLogin)} disabled={isSubmitting}>
                {isLogin ? 'Create an account' : 'Already have an account? Login'}
            </button>
        </div>
    );
}

export default LoginRegister;