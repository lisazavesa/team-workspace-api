import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { count } from 'node:console';
import { ProjectStatsDto } from './dto/project-stats.dto';
import { Project, TaskStatus } from '@prisma/client';
import { GetProjectQueryDto } from './dto/project-query.dto';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { ProjectResponseDto } from './dto/project-response.dto';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class ProjectsService {
    constructor(
        private prisma: PrismaService,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(ProjectsService.name);
    }

    private toResponseDto(project: Project) {
        return plainToInstance(ProjectResponseDto, project, {
            excludeExtraneousValues: true,
            });
        }

    async create(dto: CreateProjectDto) {
        this.logger.info(
            { teamId: dto.teamId },
            'Creating project',
        );

        const project = await this.prisma.project.create({
            data: dto
        })
        
        this.logger.info(
            { teamId: dto.teamId },
            'Project created',
        );

        return this.toResponseDto(project);
    }

    async findAll(query: GetProjectQueryDto) {
        const page = query.page ?? 1
        const limit = query.limit ?? 10
        const safeLimit = Math.min(limit, 50)
                
        const where: Prisma.ProjectWhereInput = {
            deletedAt: null,
            ...(query.name && {
                name: {
                    contains: query.name,
                    mode: Prisma.QueryMode.insensitive
                }
            }),
            ...(query.teamId && { teamId: query.teamId })
        }
                
        const total = await this.prisma.project.count({ where })
        const skip = (page - 1) * safeLimit

        const projects = await this.prisma.project.findMany({
            where,
            skip,
            take: safeLimit,
            orderBy: {
                createdAt: query.order ?? 'desc'
            },
            include: {
                team: true,
            }
        })

        const lastPage = total === 0 ? 1 : Math.ceil(total / safeLimit)
        
        return {
            data: projects.map(project => this.toResponseDto(project)),
            meta: {
                total,
                page,
                lastPage
            }
        }
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

        return this.toResponseDto(project);
    }

    //аналитический эндпоинт, возвращает числа, а не сущности/списки задач

    async getStats(id: number): Promise<ProjectStatsDto> {
        this.logger.debug({ projectId: id }, 'Calculating project stats');

        await this.findOne(id);

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

    async findByTeam(teamId: number) {
        const projects = await this.prisma.project.findMany({
            where: {
                teamId,
                deletedAt: null
            },
        })

        return {
            data: projects.map(project => this.toResponseDto(project)),
            meta: {
                total: projects.length,
            }
        }
    }

    async update(id: number, dto: UpdateProjectDto) {
        this.logger.info({ projectId: id }, 'Updating project');

        await this.findOne(id);

        const updateProject = await this.prisma.project.update({
            where: { id },
            data: dto
        })

        this.logger.info({ projectId: id }, 'Project updated');

        return this.toResponseDto(updateProject);
    }

    async remove(id: number) {
        this.logger.warn({ projectId: id }, 'Soft deleting project');

        await this.findOne(id);

        const removedProject = await this.prisma.project.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });

        this.logger.info({ projectId: id }, 'Project soft deleted');

        return this.toResponseDto(removedProject);
    }
}
