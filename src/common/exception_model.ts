import { HttpException } from '@nestjs/common';
import { ErrorCode } from './error_code';

export class ToyException extends HttpException {
  errorMessage?: string | null;

  constructor(
    public code: ErrorCode,
    public statusCode: number = 7829,
    errorMessage?: string | null,
  ) {
    super(code, statusCode);
    this.errorMessage = errorMessage;
  }
}
