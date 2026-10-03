import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool
} from "amazon-cognito-identity-js";

const viteEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {};
const poolId = viteEnv.VITE_COGNITO_USER_POOL_ID as string | undefined;
const clientId = viteEnv.VITE_COGNITO_CLIENT_ID as string | undefined;
const pool = poolId && clientId ? new CognitoUserPool({ UserPoolId: poolId, ClientId: clientId }) : null;

type User = { username: string; name: string; email: string; sub?: string };

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  demoMode: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<{ confirmed: boolean }>;
  confirmSignup: (email: string, code: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const DEMO_USER_KEY = "expenseflow_demo_user";
const demoUser = (): User => {
  const saved = localStorage.getItem(DEMO_USER_KEY);
  return saved ? JSON.parse(saved) : { username: "demo@student.com", name: "Demo Student", email: "demo@student.com", sub: "demo-user" };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const demoMode = !pool;

  useEffect(() => {
    if (!pool) {
      const logged = sessionStorage.getItem("expenseflow_demo_logged_in");
      if (logged === "true") setUser(demoUser());
      setLoading(false);
      return;
    }
    const current = pool.getCurrentUser();
    if (!current) {
      setLoading(false);
      return;
    }
    current.getSession((err: Error | null, session: any) => {
      if (err || !session?.isValid()) {
        setLoading(false);
        return;
      }
      current.getUserAttributes((attributeErr, attrs) =>  {
        const map = Object.fromEntries((attrs ?? []).map(a => [a.getName(), a.getValue()]));
        setUser({ username: current.getUsername(), name: map.name || current.getUsername(), email: map.email || current.getUsername(), sub: map.sub });
        setLoading(false);
      });
    });
  }, []);

  const login = async (email: string, password: string) => {
    if (!pool) {
      sessionStorage.setItem("expenseflow_demo_logged_in", "true");
      setUser(demoUser());
      return;
    }
    await new Promise<void>((resolve, reject) => {
      const cognitoUser = new CognitoUser({ Username: email, Pool: pool });
      cognitoUser.authenticateUser(new AuthenticationDetails({ Username: email, Password: password }), {
        onSuccess: session => {
          const payload = session.getIdToken().decodePayload();
          setUser({ username: email, name: payload.name || email.split("@")[0], email, sub: payload.sub });
          resolve();
        },
        onFailure: err => reject(new Error(err.message || "Login failed")),
        newPasswordRequired: () => reject(new Error("A new password is required for this account."))
      });
    });
  };

  const signup = async (name: string, email: string, password: string) => {
    if (!pool) {
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify({ username: email, name, email, sub: `demo-${email}` }));
      return { confirmed: true };
    }
    return await new Promise<{ confirmed: boolean }>((resolve, reject) => {
      pool.signUp(
        email,
        password,
        [
          new CognitoUserAttribute({ Name: "email", Value: email }),
          new CognitoUserAttribute({ Name: "name", Value: name })
        ],
        [],
        (err, result) => {
          if (err) reject(new Error(err.message || "Signup failed"));
          else resolve({ confirmed: !!result?.userConfirmed });
        }
      );
    });
  };

  const confirmSignup = async (email: string, code: string) => {
    if (!pool) return;
    await new Promise<void>((resolve, reject) => {
      const cognitoUser = new CognitoUser({ Username: email, Pool: pool });
      cognitoUser.confirmRegistration(code, true, err => err ? reject(new Error(err.message)) : resolve());
    });
  };

  const logout = () => {
    if (pool) pool.getCurrentUser()?.signOut();
    sessionStorage.removeItem("expenseflow_demo_logged_in");
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, demoMode, login, signup, confirmSignup, logout }), [user, loading, demoMode]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}