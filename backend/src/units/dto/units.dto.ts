import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { UnitStatus } from '@prisma/client';

export class CreateUnitDto {
  @IsString()
  buildingId!: string;

  @IsString()
  number!: string;

  @IsInt()
  @Min(0)
  floor!: number;

  @IsInt()
  @Min(1)
  areaSqm!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  peopleCount?: number;

  @IsOptional()
  @IsEnum(UnitStatus)
  status?: UnitStatus;
}

export class UpdateUnitDto {
  @IsOptional()
  @IsString()
  number?: string;

  @IsOptional()
  @IsInt()
  floor?: number;

  @IsOptional()
  @IsInt()
  areaSqm?: number;

  @IsOptional()
  @IsInt()
  peopleCount?: number;

  @IsOptional()
  @IsEnum(UnitStatus)
  status?: UnitStatus;
}
