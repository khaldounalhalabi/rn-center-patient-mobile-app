import { sanitizeString } from "@/helpers/helpers";
import { UseFormReturn } from "react-hook-form";

export enum ApiErrorType {
  UNKNOWN_ERROR = "unknown-error",
}

export interface ValidationError {
  errors: {
    [k: string]: string;
  };
  text?: string;
}

export interface ApiResponsePagination {
  current_page: number;
  per_page: number;
  is_first: boolean;
  is_last: boolean;
  has_more: boolean;
}

export class ApiResponse<T> {
  public data: T;
  public status: boolean | undefined | null;
  public code: number;
  public message: string | ValidationError | undefined | null;
  public paginate: ApiResponsePagination | undefined | null;
  public headers?: any;

  constructor(
    data: T,
    status: boolean = true,
    code: number = 500,
    message: string | ValidationError | undefined | null = null,
    paginate: ApiResponsePagination | undefined | null = null,
  ) {
    this.data = data;
    this.status = status;
    this.code = code;
    this.message = message;
    this.paginate = paginate;
  }

  public isNotAuthorized = () => this.code == 401;

  public ok = () => this.code == 200;

  public getValidationError(): [string, string][] | undefined {
    return this.message &&
      typeof this.message != "string" &&
      this.message?.hasOwnProperty("errors") &&
      this.code == 405
      ? Object.entries(this.message?.errors)
      : undefined;
  }

  public fillValidationErrors(useFormMethods: UseFormReturn) {
    const validationErrors = this.getValidationError();
    if (validationErrors) {
      validationErrors.forEach(([key, value]) => {
        useFormMethods.setError(`${key}`, {
          type: "backend-validation-error",
          message: sanitizeString(value),
        });
      });
    }
  }

  public hasValidationErrors() {
    return !!this.getValidationError();
  }

  public notVerified() {
    return this.code == 408;
  }
}
