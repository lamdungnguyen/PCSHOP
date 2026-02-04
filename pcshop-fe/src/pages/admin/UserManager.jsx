import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../../services/userService";

export default function UserManager() {
    const [users, setUsers] = useState([]);

    const [error, setError] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setError(null);
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error(error);
            setError("Cannot connect to server. Please check if the backend is running.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await deleteUser(id);
            setUsers(users.filter(u => u.id !== id));
        } catch (error) {
            alert("Failed to delete user");
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-8">User Management</h1>
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 font-medium border border-red-200">
                    ⚠️ {error}
                </div>
            )}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-bold uppercase border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Username</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-gray-500">#{user.id}</td>
                                    <td className="px-6 py-4 font-bold text-gray-900 flex items-center gap-3">
                                        {user.avatar && <img src={user.avatar} className="w-8 h-8 rounded-full" />}
                                        {user.username || user.name}
                                    </td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="text-red-600 hover:text-red-800 font-medium hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
