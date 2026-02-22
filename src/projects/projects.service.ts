import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

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
