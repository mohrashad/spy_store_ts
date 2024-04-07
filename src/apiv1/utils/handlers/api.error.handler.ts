import { ApiResponse } from './api.response.handler';

export class ApiError extends ApiResponse {
  private error: any;
  private stack: any;

  public withErrorName(error: string) {
    this.error = error;
    return this;
  }
  public withStackTrace(stack: any) {
    this.stack = stack;
    return this;
  }
}