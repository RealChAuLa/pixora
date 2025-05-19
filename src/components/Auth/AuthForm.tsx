import React, { useState, useEffect, useRef } from 'react';
import './SignupForm.css';
import './LoginForm.css';
import './AuthLayout.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthForm: React.FC<{ onClose?: () => void; onLoginSuccess: (token: string) => void }> = ({ onClose, onLoginSuccess }) => {
    const [formType, setFormType] = useState<'login' | 'signup'>('login');
    const [signupStep, setSignupStep] = useState(1);
    const authFormRef = useRef<HTMLDivElement>(null);

    const [signupData, setSignupData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        contact: '',
        dob: '',
        email: '',
        password: '',
        confirmPassword: '',
        termsAccepted: true,
    });

    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (authFormRef.current && !authFormRef.current.contains(event.target as Node)) {
                onClose?.();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'signup' | 'login') => {
        const { name, value, type: inputType, checked } = e.target;
        if (type === 'signup') {
            setSignupData((prev) => ({
                ...prev,
                [name]: inputType === 'checkbox' ? checked : value,
            }));
        } else {
            setLoginData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSignupNext = (e: React.FormEvent) => {
        e.preventDefault();
        setSignupStep(2);
    };

    const handleSignupBack = () => setSignupStep(1);

    const handleSignupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { firstName, lastName, contact, dob, email, password, confirmPassword } = signupData;
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }
        if (!signupData.termsAccepted) {
            toast.error("Please accept the terms and privacy policy.");
            return;
        }
        try {
            const payload = {
                birthday: dob,
                contact,
                email,
                first_name: firstName,
                last_name: lastName,
                password,
            };
            const response = await fetch('https://pixora-f96ef5c321f5.herokuapp.com/api/auth/signup/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const result = await response.json();
            if (response.ok) {
                toast.success('Signup successful! You can now log in.');
                setFormType('login');
            } else {
                toast.error(result.message || 'Signup failed. Please try again.');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again later.');
        }
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('username', loginData.email);
            formData.append('password', loginData.password);
            const apiUrl = 'https://pixora-f96ef5c321f5.herokuapp.com/api/auth/login/';
            const response = await fetch(apiUrl, {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            if (response.ok) {
                onLoginSuccess(result.access_token);
                toast.success('Login successful!');
            } else {
                toast.error(result.message || 'Invalid username or password');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="auth-form-container">
            <div className="ToastContainer">
                <ToastContainer theme="dark" />
            </div>
            <div className="auth-overlay" ref={authFormRef}>
                <div className="auth-box">
                    {formType === 'signup' ? (
                        signupStep === 1 ? (
                            <>
                                <h1 className="signup-title">Sign Up</h1>
                                <p className="signup-subtitle">Register to your account</p>
                                <form onSubmit={handleSignupNext}>
                                    <div className="input-group-row">
                                        <input type="text" name="firstName" placeholder="First Name" value={signupData.firstName} onChange={e => handleChange(e, 'signup')} className="signup-input half" required />
                                        <input type="text" name="lastName" placeholder="Last Name" value={signupData.lastName} onChange={e => handleChange(e, 'signup')} className="signup-input half" required />
                                    </div>
                                    <div className="input-box">
                                        <input type="text" name="username" placeholder="Username" value={signupData.username} onChange={e => handleChange(e, 'signup')} className="signup-input" required />
                                    </div>
                                    <div className="input-box">
                                        <input type="tel" name="contact" placeholder="Contact" value={signupData.contact} onChange={e => handleChange(e, 'signup')} className="signup-input" required />
                                    </div>
                                    <div className="date-input-group">
                                        <div className="date-input-wrapper">
                                            <input type="date" name="dob" value={signupData.dob} onChange={e => handleChange(e, 'signup')} className="signup-input date-input-custom" required />
                                        </div>
                                        <button type="submit" className="next-button-inline"><span>→</span></button>
                                    </div>
                                    <p className="signin-prompt">
                                        Already have an account?{' '}
                                        <button onClick={() => setFormType('login')} className="signin-link" type="button">Sign in</button>
                                    </p>
                                </form>
                            </>
                        ) : (
                            <>
                                <div className="back-button-container">
                                    <button onClick={handleSignupBack} className="back-button-circle" type="button"><span>←</span></button>
                                    <button onClick={handleSignupBack} className="back-button-text" type="button">Go Back</button>
                                </div>
                                <form onSubmit={handleSignupSubmit}>
                                    <div className="input-box">
                                        <input type="email" name="email" placeholder="Email" value={signupData.email} onChange={e => handleChange(e, 'signup')} className="signup-input" required />
                                    </div>
                                    <div className="input-box">
                                        <input type="password" name="password" placeholder="Password" value={signupData.password} onChange={e => handleChange(e, 'signup')} className="signup-input" required />
                                    </div>
                                    <div className="input-box">
                                        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={signupData.confirmPassword} onChange={e => handleChange(e, 'signup')} className="signup-input" required />
                                    </div>
                                    <div className="terms-container">
                                        <label>
                                            I agree to the <a href="/terms" className="signin-link">Terms of Use</a> and <a href="/privacy" className="signin-link">Privacy Policy</a>
                                            <input type="checkbox" name="termsAccepted" checked={signupData.termsAccepted} onChange={e => handleChange(e, 'signup')} required style={{ marginLeft: '8px' }} />
                                        </label>
                                    </div>
                                    <button type="submit" className="signup-button register"><span>Register</span></button>
                                </form>
                            </>
                        )
                    ) : (
                        <>
                            <h1 className="login-title">Welcome back</h1>
                            <p className="login-subtitle">Sign in to your account</p>
                            <form onSubmit={handleLoginSubmit}>
                                <div className="input-group">
                                    <div className="input-box">
                                        <input type="email" name="email" placeholder="Email" value={loginData.email} onChange={e => handleChange(e, 'login')} className="login-input" required />
                                    </div>
                                    <div className="input-box">
                                        <input type="password" name="password" placeholder="Password" value={loginData.password} onChange={e => handleChange(e, 'login')} className="login-input" required />
                                    </div>
                                </div>
                                <button type="submit" className="login-button"><span>Login</span></button>
                            </form>
                            <p className="signup-prompt">
                                Don't have an account?{' '}
                                <button onClick={() => setFormType('signup')} className="signup-link">Sign up</button>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthForm;