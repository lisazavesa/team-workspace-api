import { Expose } from 'class-transformer';
import { TaskStatus } from '@prisma/client';

export class TaskResponseDto {
    @Expose()
    id: number;

    @Expose()
    title: string;

    @Expose()
    description: string | null;

    @Expose()
    status: TaskStatus;

    @Expose()
    projectId: number;

    @Expose()
    assigneeId: number | null;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    @Expose()
    deleteAd: Date;
}