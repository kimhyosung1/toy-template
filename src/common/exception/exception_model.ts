import { HttpException } from '@nestjs/common';
import { KHSErrorCode } from './error_code';

export class KHSException extends HttpException {
  errorMessage?: string | null;

  constructor(
    public code: KHSErrorCode,
    public statusCode: number = 7829,
    errorMessage?: string | null,
  ) {
    super(code, statusCode);
    this.errorMessage = errorMessage;
  }
}
