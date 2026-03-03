import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { GetTeamsQueryDto } from './dto/teams-query.dto';
import { Prisma, Team } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { TeamResponseDto } from './dto/team-response.dto';

@Injectable()
export class TeamsService {
    constructor(private readonly prisma: PrismaService) {}

    private toResponseDto(team: Team) {
        return plainToInstance(TeamResponseDto, team, {
            excludeExtraneousValues: true,
            });
        }

    async create(dto: CreateTeamDto) {
        const team = await this.prisma.team.create({
            data: dto
        })

        return this.toResponseDto(team);
    }

    async findAll(query: GetTeamsQueryDto) {
        const page = query.page ?? 1
        const limit = query.limit ?? 10
        const safeLimit = Math.min(limit, 50)
        
        const where: Prisma.TeamWhereInput = {
            deletedAt: null,
            ...(query.name && {
                name: {
                    contains: query.name,
                    mode: Prisma.QueryMode.insensitive
                }
            })
        }
        
        const total = await this.prisma.team.count({ where })
        const skip = (page - 1) * safeLimit

        const teams = await this.prisma.team.findMany({
            where,
            skip,
            take: safeLimit,
            orderBy: {
                createdAt: query.order ?? 'desc'
            },
            // include: {
            //     members: true,
            //     projects: true,
            // }
        })

        const lastPage = total === 0 ? 1 : Math.ceil(total / safeLimit)
        
        return {
            data: teams.map(team => this.toResponseDto(team)),
            meta: {
                total,
                page,
                lastPage
            }
        }
    }

    async findOne(id: number) {
        const team = await this.prisma.team.findUnique({
            where: { id }
        })

        if (!team) {
                throw new NotFoundException('Team not found')
            }
        
        return this.toResponseDto(team);
    }

    async update(id: number, dto: UpdateTeamDto) {
        await this.findOne(id)

        const updatedTeam = await this.prisma.team.update({
            where: { id },
            data: dto,
        });
        
        return this.toResponseDto(updatedTeam);
    }

    async remove(id: number) {
        const team = await this.findOne(id)

        const removeTeam = await this.prisma.team.update({
            where: { id },
            data: {
                deletedAt: new Date()
            }
        })

        return this.toResponseDto(removeTeam);
    }
}
