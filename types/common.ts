export type StatusVariant = "default" | "secondary" | "success" | "warning" | "destructive" | "info";

export interface PaginationParams {
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

export interface FilterParams {
  searchQuery?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  purok?: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}
