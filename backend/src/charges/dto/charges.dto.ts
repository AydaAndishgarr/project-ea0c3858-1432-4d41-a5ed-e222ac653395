import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ChargeStatus, ChargeType } from '@prisma/client';

export class CreateChargeDto {
  @IsString()
  unitId!: string;

  @IsString()
  title!: string;

  @IsEnum(ChargeType)
  type!: ChargeType;

  @IsInt()
  @Min(0)
  amountToman!: number;

  @IsOptional()
  @IsString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  billedUserId?: string;
}

export class UpdateChargeDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(ChargeType)
  type?: ChargeType;

  @IsOptional()
  @IsInt()
  amountToman?: number;

  @IsOptional()
  @IsString()
  dueDate?: string;

  @IsOptional()
  @IsEnum(ChargeStatus)
  status?: ChargeStatus;
}
