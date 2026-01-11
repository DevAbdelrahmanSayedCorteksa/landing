export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface ApiResponseWithoutData {
  status: number;
  message: string;
}
