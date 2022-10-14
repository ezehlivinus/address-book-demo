import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common';
import { Response } from 'express';
import mongoose from 'mongoose';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('SupplyChain');
  catch(exception: unknown, host: ArgumentsHost) {
    this.logger.error(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const mongooseValidationError = mongoose.Error.ValidationError;

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const errorResponse = exception.getResponse() as {
        message: string[] | string;
      };
      return response.status(status).json({
        status: 'error',
        error: Array.isArray(errorResponse.message)
          ? errorResponse.message[0]
          : errorResponse.message,
        errors: Array.isArray(errorResponse.message)
          ? errorResponse.message
          : undefined
      });
    }

    if (exception instanceof mongooseValidationError) {
      const errorMessages: string[] = Object.values(exception.errors).map(
        (e) => e.message
      );
      return response.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        error: errorMessages[0],
        errors: errorMessages
      });
    }

    const errorMessage = 'Something went wrong. Please try again later';
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      error: 'Something went wrong. Please try again later'
    });
  }
}
