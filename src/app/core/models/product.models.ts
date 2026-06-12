export interface Product {
  id?: number;
  sku: string;
  name: string;
  price: number;
  description: string;
}

export interface BackendError {
  status: number;
  error: string;
  message: string;
  path: string;
}

export interface ApiResponse<T> {
  data: T;
}
