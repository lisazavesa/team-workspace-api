import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator'
import { TaskStatus } from '@prisma/client'

export class CreateTaskDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsInt()
    projectId: number;

    @IsOptional()
    @IsInt()
    assigneeId?: number;

    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

}