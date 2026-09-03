import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();

// ==========================================
// AUTH PROVIDER
// ==========================================

export function AuthProvider({ children }) {
  // ==========================================
  // CURRENT USER
  // ==========================================

  const [user, setUser] = useState(() => {
    try {
      const savedUser =
        JSON.parse(
          localStorage.getItem("currentUser")
        ) || null;

      return savedUser;
    } catch (error) {
      console.error(
        "Failed to load current user:",
        error
      );

      return null;
    }
  });

  // ==========================================
  // CREATE DEFAULT ADMIN
  // ==========================================

  function createAdminAccount() {
    const users =
      JSON.parse(
        localStorage.getItem("users")
      ) || [];

    const adminExists = users.some(
      (item) =>
        item.email ===
        "admin@techzone.com"
    );

    if (!adminExists) {
      const admin = {
        id: 999,

        name: "TechZone Admin",

        email: "admin@techzone.com",

        password: "admin123",

        role: "admin",
      };

      localStorage.setItem(
        "users",
        JSON.stringify([
          ...users,
          admin,
        ])
      );
    }
  }

  // ==========================================
  // REPAIR CURRENT USER
  // ==========================================

  function repairCurrentUser() {
    try {
      const currentUser =
        JSON.parse(
          localStorage.getItem("currentUser")
        );

      if (!currentUser) {
        return;
      }

      // User already has an ID
      if (currentUser.id) {
        return;
      }

      const users =
        JSON.parse(
          localStorage.getItem("users")
        ) || [];

      const matchingUser =
        users.find(
          (item) =>
            item.email ===
            currentUser.email
        );

      if (matchingUser) {
        setUser(matchingUser);

        localStorage.setItem(
          "currentUser",
          JSON.stringify(matchingUser)
        );

        console.log(
          "Current user ID repaired:",
          matchingUser.id
        );
      }
    } catch (error) {
      console.error(
        "Failed to repair current user:",
        error
      );
    }
  }

  // ==========================================
  // APP START
  // ==========================================

  useEffect(() => {
    createAdminAccount();

    repairCurrentUser();
  }, []);

  // ==========================================
  // REGISTER
  // ==========================================

  function register(
    name,
    email,
    password
  ) {
    const users =
      JSON.parse(
        localStorage.getItem("users")
      ) || [];

    // ========================================
    // CHECK EXISTING USER
    // ========================================

    const existingUser =
      users.find(
        (item) =>
          item.email.toLowerCase() ===
          email.toLowerCase()
      );

    if (existingUser) {
      return {
        success: false,

        message:
          "Email already registered!",
      };
    }

    // ========================================
    // CREATE USER
    // ========================================

    const newUser = {
      id: Date.now(),

      name: name.trim(),

      email: email.trim().toLowerCase(),

      password,

      role: "user",
    };

    // ========================================
    // SAVE USER
    // ========================================

    const updatedUsers = [
      ...users,
      newUser,
    ];

    localStorage.setItem(
      "users",
      JSON.stringify(updatedUsers)
    );

    // ========================================
    // LOGIN USER
    // ========================================

    setUser(newUser);

    localStorage.setItem(
      "currentUser",
      JSON.stringify(newUser)
    );

    console.log(
      "Registered user:",
      newUser
    );

    return {
      success: true,

      user: newUser,
    };
  }

  // ==========================================
  // LOGIN
  // ==========================================

  function login(
    email,
    password
  ) {
    const users =
      JSON.parse(
        localStorage.getItem("users")
      ) || [];

    const foundUser =
      users.find(
        (item) =>
          item.email.toLowerCase() ===
            email.toLowerCase() &&
          item.password === password
      );

    // ========================================
    // INVALID LOGIN
    // ========================================

    if (!foundUser) {
      return {
        success: false,

        message:
          "Invalid email or password!",
      };
    }

    // ========================================
    // ENSURE USER HAS ID
    // ========================================

    let loggedInUser = foundUser;

    if (!foundUser.id) {
      loggedInUser = {
        ...foundUser,

        id: Date.now(),
      };

      const updatedUsers =
        users.map((item) =>
          item.email ===
          foundUser.email
            ? loggedInUser
            : item
        );

      localStorage.setItem(
        "users",
        JSON.stringify(updatedUsers)
      );
    }

    // ========================================
    // SAVE CURRENT USER
    // ========================================

    localStorage.setItem(
      "currentUser",
      JSON.stringify(loggedInUser)
    );

    setUser(loggedInUser);

    console.log(
      "Logged in user:",
      loggedInUser
    );

    return {
      success: true,

      user: loggedInUser,
    };
  }

  // ==========================================
  // LOGOUT
  // ==========================================

  function logout() {
    setUser(null);

    localStorage.removeItem(
      "currentUser"
    );
  }

  // ==========================================
  // CONTEXT
  // ==========================================

  return (
    <AuthContext.Provider
      value={{
        user,

        register,

        login,

        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ==========================================
// USE AUTH
// ==========================================

export function useAuth() {
  return useContext(AuthContext);
}
