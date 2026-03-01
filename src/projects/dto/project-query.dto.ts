import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { Transform, Type } from 'class-transformer';

export class GetProjectQueryDto {
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    @Min(1)
    page?: number;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Max(50)
    @Min(1)
    limit?: number;

    @IsOptional()
    @IsString()
    @IsEnum(['asc', 'desc'])
    order?: 'asc' | 'desc';

    @IsOptional()
    @IsString()
    name?: string

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Transform(({ value }) => parseInt(value)) 
    teamId?: number
}