import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { count } from 'node:console';
import { ProjectStatsDto } from './dto/project-stats.dto';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class ProjectsService {
    constructor(private prisma: PrismaService) {}

    create(dto: CreateProjectDto) {
        return this.prisma.project.create({
            data: {
                name: dto.name,
                team: {
                    connect: { id: dto.teamId}
                }
            }, 
            include: {
                team: true
            }
        })
    }

    findAll() {
        return this.prisma.project.findMany({
            where: {
                deletedAt: null,
            },
            include: {
                team: true,
            },
        })
    }

    async findOne(id: number) {
        const project = await this.prisma.project.findFirst({
            where: {
                id,
                deletedAt: null
            },
            include: {
                team: true,
                tasks: true
            }
        })

        if (!project) {
            throw new NotFoundException('Project not found')
        }

        return project
    }

    async getStats(id: number): Promise<ProjectStatsDto> {
        const project = await this.prisma.project.findFirst({
            where: {
                id,
                deletedAt: null
            }
        })

        if (!project) {
            throw new NotFoundException('Project not found')
        }

        const tasks = await this.prisma.task.groupBy({
            by: ['status'],
            where: {
                projectId: id,
                deletedAt: null
            },
            _count: {
                _all: true
            }
        })

        let totalTasks = 0;

        let completedTasks = 0;
        let inProgressTasks = 0;
        let todoTasks = 0;
        let progress = 0;

        tasks.forEach( task => {
            totalTasks += task._count._all

            if (task.status === TaskStatus.DONE) {
                completedTasks = task._count._all
            }
            if (task.status === TaskStatus.IN_PROGRESS) {
                inProgressTasks = task._count._all
            }
            if (task.status === TaskStatus.TODO) {
                todoTasks = task._count._all
            }
        })

        if (totalTasks === 0) {
            progress = 0
        } else {
            progress = Math.round((completedTasks / totalTasks) * 100)
        }

        return {
            id,
            totalTasks,
            completedTasks,
            inProgressTasks,
            todoTasks,
            progress
        }
    }

    findByTeam(teamId: number) {
        return this.prisma.project.findMany({
            where: {
                teamId,
                deletedAt: null
            },
        })
    }

    async update(id: number, dto: UpdateProjectDto) {
        const project = await this.prisma.project.findFirst({
            where: {
                id,
                deletedAt: null
            }
        })

        if (!project) {
            throw new NotFoundException('Project not found')
        }

        return this.prisma.project.update({
            where: { id },
            data: dto
        })
    }

    async remove(id: number) {
        const project = await this.findOne(id)

        if (!project) {
                throw new NotFoundException('Project not found')
            }

        return this.prisma.project.update({
            where: { id },
            data: {
                deletedAt: new Date()
            }
        })
    }
}
