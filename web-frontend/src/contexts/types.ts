export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  tenantId: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export type AuthContextValue = AuthContextType | undefined;