// Frontend (React.js - LoginRegister.js)
import React, { useState } from 'react';
import axios from 'axios';
import './LoginRegister.css';

function LoginRegister() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [city, setCity] = useState('');
    const [province, setProvince] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            setIsSubmitting(true);
            if (isLogin) {
                const baseUrl = process.env.REACT_APP_API_BASE_URL || 'localhost:3000';
                const response = await axios.post(baseUrl + '/auth/login', { email, password });

                console.log(response);
                alert(response.data);
            } else {
                const response = await axios.post('/api/register', {
                    name,
                    email,
                    password,
                    role,
                    address: {
                        address1,
                        address2,
                        city,
                        province,
                        postalCode,
                    },
                });
                alert(response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('An unexpected error occurred' + error.message);
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
                            value={address1}
                            onChange={(e) => setAddress1(e.target.value)}
                            className="form-input"
                        />
                        <input
                            type="text"
                            placeholder="Address 2"
                            value={address2}
                            onChange={(e) => setAddress2(e.target.value)}
                            className="form-input"
                        />
                        <input
                            type="text"
                            placeholder="City*"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="form-input"
                        />
                        <input
                            type="text"
                            placeholder="Province*"
                            value={province}
                            onChange={(e) => setProvince(e.target.value)}
                            className="form-input"
                        />
                        <input
                            type="text"
                            placeholder="Postal Code*"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            className="form-input"
                        />
                    </>
                )}
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

