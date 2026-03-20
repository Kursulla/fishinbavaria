import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./LoginPage.css";

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, isBootstrapping, login } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isBootstrapping && isAuthenticated) {
        return <Navigate to={location.state?.from?.pathname || "/"} replace />;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const user = await login({ username, password });
            navigate(user.role === "ADMIN" ? "/admin/users" : "/", { replace: true });
        } catch (submitError) {
            setError(submitError.message || "Prijava nije uspela.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="login-page">
            <form className="login-card" onSubmit={handleSubmit}>
                <img className="login-logo" src="/logo_300.png" alt="Catch the License" />
                <h1>Prijava</h1>
                <label className="login-field">
                    <span>Korisničko ime</span>
                    <input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" />
                </label>
                <label className="login-field">
                    <span>Lozinka</span>
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="current-password"
                    />
                </label>
                {error && <p className="login-error">{error}</p>}
                <button type="submit" className="login-submit" disabled={isSubmitting}>
                    {isSubmitting ? "Prijavljivanje..." : "Prijavi se"}
                </button>
            </form>
        </div>
    );
}
