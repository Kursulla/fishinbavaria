import React, { useEffect, useState } from "react";
import { usersApi } from "../../users/api/usersApi";
import { useAuth } from "../../auth/context/AuthContext";
import "./AdminUsersPage.css";

const initialFormState = {
    username: "",
    firstName: "",
    lastName: "",
    password: "",
    role: "USER",
};

export default function AdminUsersPage() {
    const { currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [formState, setFormState] = useState(initialFormState);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        usersApi
            .listUsers()
            .then(setUsers)
            .catch((loadError) => setError(loadError.message || "Ne mogu da učitam korisnike."))
            .finally(() => setIsLoading(false));
    }, []);

    async function handleCreateUser(event) {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const user = await usersApi.createUser(formState);
            setUsers((currentUsers) => [user, ...currentUsers]);
            setFormState(initialFormState);
        } catch (submitError) {
            setError(submitError.message || "Ne mogu da kreiram korisnika.");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDeleteUser(userId) {
        setError("");

        try {
            await usersApi.deleteUser(userId);
            setUsers((currentUsers) => currentUsers.filter((user) => user.id !== userId));
        } catch (deleteError) {
            setError(deleteError.message || "Ne mogu da obrišem korisnika.");
        }
    }

    async function handleToggleActive(user) {
        setError("");

        try {
            const updatedUser = await usersApi.updateUser(user.id, {
                isActive: !user.isActive,
            });

            setUsers((currentUsers) =>
                currentUsers.map((currentUserRecord) => (currentUserRecord.id === updatedUser.id ? updatedUser : currentUserRecord))
            );
        } catch (updateError) {
            setError(updateError.message || "Ne mogu da izmenim korisnika.");
        }
    }

    return (
        <div className="admin-users-page">
            <section className="admin-users-panel">
                <div className="admin-users-panel-heading">
                    <div>
                        <p className="admin-users-eyebrow">Admin panel</p>
                        <h1>Korisnici</h1>
                    </div>
                    <p>Ulogovan kao {currentUser?.firstName} {currentUser?.lastName}</p>
                </div>
                <form className="admin-users-form" onSubmit={handleCreateUser}>
                    <input
                        placeholder="Korisničko ime"
                        value={formState.username}
                        onChange={(event) => setFormState((currentState) => ({ ...currentState, username: event.target.value }))}
                    />
                    <input
                        placeholder="Ime"
                        value={formState.firstName}
                        onChange={(event) => setFormState((currentState) => ({ ...currentState, firstName: event.target.value }))}
                    />
                    <input
                        placeholder="Prezime"
                        value={formState.lastName}
                        onChange={(event) => setFormState((currentState) => ({ ...currentState, lastName: event.target.value }))}
                    />
                    <input
                        type="password"
                        placeholder="Lozinka"
                        value={formState.password}
                        onChange={(event) => setFormState((currentState) => ({ ...currentState, password: event.target.value }))}
                    />
                    <select
                        value={formState.role}
                        onChange={(event) => setFormState((currentState) => ({ ...currentState, role: event.target.value }))}
                    >
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Čuvanje..." : "Dodaj korisnika"}
                    </button>
                </form>
                {error && <p className="admin-users-error">{error}</p>}
            </section>

            <section className="admin-users-panel">
                <div className="admin-users-panel-heading">
                    <div>
                        <p className="admin-users-eyebrow">Pregled</p>
                        <h2>Svi korisnici</h2>
                    </div>
                </div>
                {isLoading ? (
                    <p>Učitavanje korisnika...</p>
                ) : (
                    <div className="admin-users-table-wrap">
                        <table className="admin-users-table">
                            <thead>
                                <tr>
                                    <th>Korisničko ime</th>
                                    <th>Ime i prezime</th>
                                    <th>Rola</th>
                                    <th>Status</th>
                                    <th>Akcije</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.username}</td>
                                        <td>{user.firstName} {user.lastName}</td>
                                        <td>{user.role}</td>
                                        <td>{user.isActive ? "Aktivan" : "Neaktivan"}</td>
                                        <td className="admin-users-actions">
                                            <button type="button" onClick={() => handleToggleActive(user)}>
                                                {user.isActive ? "Deaktiviraj" : "Aktiviraj"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteUser(user.id)}
                                                disabled={user.id === currentUser?.id}
                                            >
                                                Obriši
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}
