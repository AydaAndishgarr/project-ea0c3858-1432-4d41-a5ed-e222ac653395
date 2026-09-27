import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { BuildingStatus, BuildingType, PlanType } from '@prisma/client';

export class CreateBuildingDto {
  @IsString()
  name!: string;

  @IsString()
  address!: string;

  @IsEnum(BuildingType)
  type!: BuildingType;

  @IsOptional()
  @IsEnum(BuildingStatus)
  status?: BuildingStatus;

  @IsOptional()
  @IsString()
  managerId?: string;

  @IsOptional()
  @IsEnum(PlanType)
  plan?: PlanType;

  @IsOptional()
  @IsInt()
  @Min(0)
  priceToman?: number;
}

export class UpdateBuildingDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEnum(BuildingType)
  type?: BuildingType;

  @IsOptional()
  @IsEnum(BuildingStatus)
  status?: BuildingStatus;

  @IsOptional()
  @IsString()
  managerId?: string;

  @IsOptional()
  @IsEnum(PlanType)
  plan?: PlanType;
}
