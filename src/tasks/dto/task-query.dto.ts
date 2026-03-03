import { IsInt, IsOptional, IsEnum, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskStatus } from '@prisma/client';

export class GetTaskQueryDto {
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Min(1)
    page?: number;
    
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Min(1)
    @Max(50)
    limit?: number;
    
    @IsOptional()
    @IsString()
    @IsEnum(['asc', 'desc'])
    order?: 'asc' | 'desc';
    
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;
    
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    projectId?: number;
    
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    assigneeId?: number;
}