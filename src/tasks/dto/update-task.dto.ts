import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator'
import { TaskStatus } from '@prisma/client'

export class UpdateTaskDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsInt()
    assigneeId?: number;

    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

}