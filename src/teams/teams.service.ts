import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { GetTeamsQueryDto } from './dto/teams-query.dto';
import { Prisma, Team } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { TeamResponseDto } from './dto/team-response.dto';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class TeamsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(TeamsService.name);
    }

    private toResponseDto(team: Team) {
        return plainToInstance(TeamResponseDto, team, {
            excludeExtraneousValues: true,
            });
        }

    async create(dto: CreateTeamDto) {
        this.logger.info(
            { name: dto.name },
            'Creating team',
        );

        const team = await this.prisma.team.create({
            data: dto
        })

        this.logger.info(
            { name: dto.name },
            'Team created',
        );

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
        this.logger.info({ teamId: id }, 'Updating team');

        await this.findOne(id)

        const updatedTeam = await this.prisma.team.update({
            where: { id },
            data: dto,
        });

        this.logger.info({ teamId: id }, 'Team updated');
        
        return this.toResponseDto(updatedTeam);
    }

    async remove(id: number) {
        this.logger.warn({ teamId: id }, 'Soft deleting team');

        const team = await this.findOne(id)

        const removeTeam = await this.prisma.team.update({
            where: { id },
            data: {
                deletedAt: new Date()
            }
        })

        this.logger.info({ teamId: id }, 'Team soft deleted');

        return this.toResponseDto(removeTeam);
    }
}
