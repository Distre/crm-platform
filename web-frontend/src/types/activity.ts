export interface Activity {
  id: string;
  userId: number;
  action: string;
  description: string;
  resourceId?: string;
  resourceType?: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export type ActivityAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'VIEW'
  | 'LOGIN'
  | 'LOGOUT'
  | 'ERROR';
