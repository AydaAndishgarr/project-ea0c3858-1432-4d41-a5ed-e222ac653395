import { ArgumentsHost, Catch, ConflictException, ExceptionFilter, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AllExceptionsFilter } from './http-exception.filter';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly fallback = new AllExceptionsFilter();

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    if (exception.code === 'P2002') {
      return this.fallback.catch(new ConflictException('A record with this unique value already exists'), host);
    }
    if (exception.code === 'P2025') {
      return this.fallback.catch(new NotFoundException('Record not found'), host);
    }
    if (exception.code === 'P2003') {
      return this.fallback.catch(new ConflictException('Related record constraint failed'), host);
    }
    return this.fallback.catch(exception, host);
  }
}
