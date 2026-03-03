import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Prisma, TaskStatus } from '@prisma/client';
import { promises as fs } from 'fs';
import * as path from 'path'
import { GetTaskQueryDto } from './dto/task-query.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { plainToInstance } from 'class-transformer';
import { Task } from '@prisma/client';

@Injectable()
export class TasksService {
    constructor(
        private prisma: PrismaService,
    ) {}

    // private mapToResponse(task: any): TaskResponseDto {
    //     return {
    //         id: task.id,
    //         title: task.title,
    //         description: task.description,
    //         status: task.status,
    //         projectId: task.projectId,
    //         assigneeId: task.assigneeId,
    //         createdAt: task.createdAt,
    //         updatedAt: task.updatedAt,
    //     };
    // }

    private toResponseDto(task: Task) {
        return plainToInstance(
            TaskResponseDto, 
            {
                ...task,
                sCompleted: task.status === TaskStatus.DONE,
            }, 
            { excludeExtraneousValues: true, }
        );
    }

    async create(dto: CreateTaskDto) {
        const project = await this.prisma.project.findFirst({
            where: {
                id: dto.projectId,
                deletedAt: null
            }
        })

        if (!project) {
            throw new NotFoundException('Project not found')
        }

        if (dto.assigneeId) {
            const user = await this.prisma.user.findFirst({
                where: {
                    id: dto.assigneeId,
                    deletedAt: null
                }
            })

            if (!user) {
                throw new NotFoundException('User not found')
            }
        }

        const task = await this.prisma.task.create({
            data: {
                title: dto.title,
                description: dto.description,
                status: dto.status,
                project: {
                    connect: { id: dto.projectId }
                },
                assignee: dto.assigneeId
                ? { connect: { id: dto.assigneeId } } : undefined
            },

            include: {
                project: true,
                assignee: true,
                files: true
            }
        })

        return this.toResponseDto(task);
    }

    async findAll(query: GetTaskQueryDto) {
        const page = query.page ?? 1
        const limit = query.limit ?? 10
        const safeLimit = Math.min(limit, 50)

        const where: Prisma.TaskWhereInput = {
            deletedAt: null,
            ...(query.status && { status: query.status }),
            ...(query.projectId && { projectId: query.projectId }),
            ...(query.assigneeId && { assigneeId: query.assigneeId }),
        }

        const total = await this.prisma.task.count({ where })
        const skip = (page - 1) * safeLimit

        const tasks = await this.prisma.task.findMany({
            where,
            skip,
            take: safeLimit,
            orderBy: {
                createdAt: query.order ?? 'desc'
            },
            include: {
                project: true,
                assignee: true
            }
        })

        return {
            data: tasks.map((task) => this.toResponseDto(task)),
            meta: {
                total,
                page,
                lastPage: Math.ceil(total/safeLimit)
            }
        };
    }

    async findOne(id: number) {
        const task = await this.prisma.task.findFirst({
            where: {
                id,
                deletedAt: null
            },
            include: {
                project: true,
                assignee: true,
                files: true,
            }
        })
        if (!task) {
            throw new NotFoundException('Task not found')
        } 

        return this.toResponseDto(task);
    }

    async update(id: number, dto: UpdateTaskDto) {
        await this.findOne(id);

        const updatedTask = await this.prisma.task.update({
            where: { id },
            data: dto,
            include: {
                project: true,
                assignee: true,
                files: true,
            }
        })

        return this.toResponseDto(updatedTask);
    }

    async remove(id: number) {
        await this.findOne(id)

        const removedTask = await this.prisma.task.update({
            where: { id },
            data: {
                deletedAt: new Date()
            }
        })

        return this.toResponseDto(removedTask);
    }

    async uploadFile(taskId: number, file: Express.Multer.File) {
        await this.findOne(taskId);

        return this.prisma.file.create({
            data: {
                fileName: file.originalname,
                path: file.filename,
                taskId: taskId
            }
        })
    }

    async findAllFiles(taskId: number) {
        await this.findOne(taskId);

        return this.prisma.file.findMany({
            where: { taskId },
        });
    }

    async deleteFile(taskId: number, fileId: number) {
        const file = await this.prisma.file.findFirst({
            where: {
                id: fileId,
                taskId,
            }
        })

        if (!file) {
            throw new NotFoundException('File not found')
        } 

        const filePath = path.join(process.cwd(), 'uploads', file.path)

        try {
            await fs.unlink(filePath)
        } catch (error) {
            console.error('Error deleting file from disk:', error)
        }

        await this.prisma.file.delete({
            where: { id: fileId }
        })

        return { success: true };
    }

    
}
