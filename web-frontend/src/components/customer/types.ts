/**
 * Customer interface representing a customer entity from the backend
 */
export interface Customer {
    id: number;
    name: string;
    tenantId: string;
  }
  
  /**
   * CustomerFormData interface for creating/updating customers
   */
  export interface CustomerFormData {
    name: string;
  }