import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { useNavigate, useLocation } from 'react-router-dom';
import "./loginPage.css";

function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        address: '',
        phone: ''
    });

    const { login, signup } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!isLogin) {
            if (formData.password.length < 8) {
                setError("הסיסמה חייבת להכיל לפחות 8 תווים");
                return false;
            }
            if (formData.password !== formData.confirmPassword) {
                setError("הסיסמאות אינן תואמות");
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!validateForm()) return;

        try {
            if (isLogin) {
                const result = await login(formData.email, formData.password);
                if (result.success) {
                    const from = location.state?.from || "/user";
                    navigate(from);
                } else {
                    setError(result.message || "פרטי התחברות שגויים");
                }
            } else {
                const result = await signup(formData);
                if (result.success) {
                    setIsLogin(true);
                    setError("נרשמת בהצלחה! כעת ניתן להתחבר");
                } else {
                    setError(result.message || "הרשמה נכשלה");
                }
            }
        } catch (err) {
            setError("שגיאת תקשורת עם השרת. נסה שוב מאוחר יותר");
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>{isLogin ? "התחברות" : "הרשמה"}</h2>

                {error && <p className={`message ${error.includes("בהצלחה") ? "success" : "error"}`}>{error}</p>}

                {!isLogin && (
                    <input type="text" name="name" placeholder="שם מלא" onChange={handleChange} required />
                )}

                <input type="email" name="email" placeholder="אימייל" onChange={handleChange} required />

                <input type="password" name="password" placeholder="סיסמה" onChange={handleChange} required />

                {!isLogin && (
                    <>
                        <input type="password" name="confirmPassword" placeholder="אימות סיסמה" onChange={handleChange} required />
                        <input type="text" name="address" placeholder="כתובת למשלוח" onChange={handleChange} required />
                        <input type="tel" name="phone" placeholder="טלפון" onChange={handleChange} required />
                    </>
                )}

                <button type="submit">{isLogin ? "כניסה" : "צרו חשבון"}</button>

                <p className="toggle-text" onClick={() => { setIsLogin(!isLogin); setError(""); }}>
                    {isLogin ? "אין לך חשבון? הירשם כאן" : "כבר יש לך חשבון? התחבר כאן"}
                </p>
            </form>
        </div>
    );
}

export default LoginPage;