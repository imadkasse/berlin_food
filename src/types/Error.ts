export type ApiSuccess<T> = {
  data: T;
};

export type ApiError = {
  error: {
    message: string;
    code?: string;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;


