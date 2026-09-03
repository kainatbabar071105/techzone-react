import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function AdminUsers() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  // ==========================================
  // LOAD USERS
  // ==========================================

  function loadUsers() {
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];

    setUsers(savedUsers);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  // ==========================================
  // DELETE USER
  // ==========================================

  function deleteUser(userId) {
    // Prevent deleting yourself

    if (currentUser && currentUser.id === userId) {
      alert("You cannot delete your own admin account.");

      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmed) {
      return;
    }

    const updatedUsers = users.filter((user) => user.id !== userId);

    setUsers(updatedUsers);

    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Remove user's cart

    localStorage.removeItem(`cartItems_${userId}`);

    // Remove user's wishlist

    localStorage.removeItem(`wishlist_${userId}`);

    alert("User deleted successfully.");
  }

  // ==========================================
  // SEARCH USERS
  // ==========================================

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();

    return (
      String(user.id).toLowerCase().includes(search) ||
      user.name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="admin-users">
      {/* =====================================
          HEADER
      ====================================== */}

      <div className="admin-page-heading">
        <div>
          <h2>Users Management</h2>

          <p>View and manage registered TechZone users.</p>
        </div>
      </div>

      {/* =====================================
          TOOLBAR
      ====================================== */}

      <div className="users-toolbar">
        <div>
          <h3>Registered Users</h3>

          <p>{users.length} total users</p>
        </div>

        <input
          type="text"
          placeholder="Search by name, email or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* =====================================
          USER TABLE
      ====================================== */}

      {filteredUsers.length === 0 ? (
        <div className="admin-empty">
          <h3>No users found</h3>

          <p>Try another search term.</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>

                <th>Name</th>

                <th>Email</th>

                <th>Role</th>

                <th>Account</th>

                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => {
                const isCurrentUser = currentUser && currentUser.id === user.id;

                const isAdmin = user.role === "admin";

                return (
                  <tr key={user.id}>
                    {/* ID */}

                    <td>
                      <span className="user-id">{user.id}</span>
                    </td>

                    {/* NAME */}

                    <td>
                      <strong>{user.name}</strong>
                    </td>

                    {/* EMAIL */}

                    <td>{user.email}</td>

                    {/* ROLE */}

                    <td>
                      <span className={isAdmin ? "role-admin" : "role-user"}>
                        {isAdmin ? "Admin" : "User"}
                      </span>
                    </td>

                    {/* ACCOUNT */}

                    <td>
                      {isCurrentUser ? (
                        <span className="account-current">Current Account</span>
                      ) : (
                        <span className="account-active">Active</span>
                      )}
                    </td>

                    {/* ACTIONS */}

                    <td>
                      {isCurrentUser ? (
                        <span className="cannot-delete">Protected</span>
                      ) : isAdmin ? (
                        <span className="cannot-delete">Admin Protected</span>
                      ) : (
                        <button
                          className="delete-button"
                          onClick={() => deleteUser(user.id)}
                        >
                          🗑️ Delete
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
