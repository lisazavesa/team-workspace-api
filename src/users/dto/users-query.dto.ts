import { IsEmail, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { Type } from 'class-transformer';

export class GetUsersQueryDto {
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
    @IsEmail()
    email?: string
}