import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { TaskStatus } from '@prisma/client'
import { Type } from 'class-transformer';

export class GetTaskQueryDto {
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
    @IsEnum(TaskStatus)
    status?: TaskStatus;

    @IsOptional()
    @IsInt()
    projectId?: number;

    @IsOptional()
    @IsInt()
    assigneeId?: number

}