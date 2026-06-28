import { User, Role } from "../types";

const CURRENT_USER_KEY = "civica_current_user";
const AUTH_SESSION_KEY = "civica_auth_session";
const REGISTERED_USERS_KEY = "civica_registered_users";

export const DEMO_USERS: User[] = [
  {
    email: "citizen@civica.ai",
    password: "123456",
    name: "Riya Sharma",
    role: "citizen"
  },
  {
    email: "admin@civica.ai",
    password: "123456",
    name: "Ananya Rao",
    role: "admin"
  },
  {
    email: "contractor@civica.ai",
    password: "123456",
    name: "Ravi Kumar",
    role: "contractor",
    contractorName: "AquaFix Services"
  },
  {
    email: "auditor@civica.ai",
    password: "123456",
    name: "Meera Iyer",
    role: "auditor"
  }
];

export const getRegisteredUsers = (): User[] => {
  const usersStr = localStorage.getItem(REGISTERED_USERS_KEY);
  if (usersStr) {
    return JSON.parse(usersStr);
  }
  return DEMO_USERS;
};

export const registerUser = (user: User) => {
  const users = getRegisteredUsers();
  users.push(user);
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
};

export const login = (email: string, password?: string): User | null => {
  const users = getRegisteredUsers();
  const user = users.find(u => u.email === email && (u.password === password || !password));
  
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    localStorage.setItem(AUTH_SESSION_KEY, "true");
    return user;
  }
  return null;
};

export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem(AUTH_SESSION_KEY);
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem(CURRENT_USER_KEY);
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem(AUTH_SESSION_KEY) === "true";
};

export const hasRole = (role: Role | Role[]): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  if (Array.isArray(role)) {
    return role.includes(user.role);
  }
  return user.role === role;
};

export const getRoleHomeRoute = (role: Role): string => {
  switch (role) {
    case "citizen": return "/create-case";
    case "admin": return "/dashboard";
    case "contractor": return "/contractor-task-list";
    case "auditor": return "/reports";
    default: return "/";
  }
};
