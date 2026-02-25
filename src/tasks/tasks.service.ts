import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) {}

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
            throw new NotFoundException('Project not found')
        }
        }
        return this.prisma.task.create({
            data: {
                title: dto.title,
                description: dto.description,
                status: dto.status,
                project: {
                    connect: { id: dto.projectId}
                },
                assignee: dto.assigneeId
                ? { connect: { id: dto.assigneeId} } : undefined
            },

            include: {
                project: true,
                assignee: true,
            }
        })
    }

    findAll(filters: {
        status?: TaskStatus
        projectId?: number
        assigneeId?: number
    }) {
        return this.prisma.task.findMany({
            where: {
                deletedAt: null,
                ...(filters.status && { status: filters.status }),
                ...(filters.projectId && { projectId: filters.projectId }),
                ...(filters.assigneeId && { assigneeId: filters.assigneeId }),
            },
            
            include: {
                project: true,
                assignee: true,
            }
        })
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
            }
        })
        if (!task) {
            throw new NotFoundException('Task not found')
        } 

        return task
    }

    async update(id: number, dto: UpdateTaskDto) {
        await this.findOne(id)

        return this.prisma.task.update({
            where: { id },
            data: dto
        })
    }

    async remove(id: number) {
        await this.findOne(id)

        return this.prisma.task.update({
            where: { id },
            data: {
                deletedAt: new Date()
            }
        })
    }

    async uploadFile(taskId: number, file: Express.Multer.File) {
        const task = await this.prisma.task.findUnique({
            where: { id: taskId },
        })

        if (!task) {
            throw new NotFoundException('Task not found')
        } 

        return this.prisma.file.create({
            data: {
                fileName: file.originalname,
                path: file.filename,
                taskId: taskId
            }
        })
    }
}
