import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../../../theme/ThemeContext";
import {
    trackLoginFailure,
    trackLoginSuccess,
} from "../../analytics/analyticsEvents";
import "./LoginPage.css";

export default function LoginPage() {
    const backgroundOptions = ["bgd_1.png", "bgd_2.png", "bgd_3.png"];
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, isBootstrapping, login } = useAuth();
    const { theme } = useTheme();
    const [backgroundImage] = useState(() => {
        const randomIndex = Math.floor(Math.random() * backgroundOptions.length);
        return backgroundOptions[randomIndex];
    });
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
            trackLoginSuccess(user.role);
            navigate(user.role === "ADMIN" ? "/admin/users" : "/", { replace: true });
        } catch (submitError) {
            trackLoginFailure();
            setError(submitError.message || "Prijava nije uspela.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div
            className="login-page"
            style={{ "--login-page-background-image": `url(${process.env.PUBLIC_URL}/${backgroundImage})` }}
        >
            <form className="login-card" onSubmit={handleSubmit}>
                <img className="login-logo" src={theme === "dark" ? "/logo_500_dark.png" : "/logo_500.png"} alt="Catch the License" />
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
