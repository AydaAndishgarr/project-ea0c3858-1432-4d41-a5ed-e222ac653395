import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

function toBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value === '1';
  }
  return false;
}

export class EnvironmentVariables {
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(String(value), 10))
  PORT!: number;

  @IsIn(['development', 'test', 'production'])
  NODE_ENV!: 'development' | 'test' | 'production';

  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;

  @IsString()
  @IsNotEmpty()
  API_PREFIX!: string;

  @IsString()
  @IsNotEmpty()
  FRONTEND_ORIGIN!: string;

  @IsString()
  @MinLength(16)
  JWT_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  JWT_EXPIRES_IN!: string;

  @IsString()
  @IsNotEmpty()
  COOKIE_NAME!: string;

  @IsBoolean()
  @Transform(({ value }) => toBoolean(value))
  COOKIE_SECURE!: boolean;

  @IsIn(['lax', 'strict', 'none'])
  COOKIE_SAME_SITE!: 'lax' | 'strict' | 'none';

  @IsOptional()
  @IsString()
  SEED_DEMO_PASSWORD?: string;

  @IsOptional()
  @IsEmail()
  SEED_ADMIN_EMAIL?: string;
}
